package AgricultureProject.auth;

import AgricultureProject.audit.entity.AuditAction;
import AgricultureProject.audit.service.AuditService;
import AgricultureProject.security.JwtService;
import AgricultureProject.user.entity.Role;
import AgricultureProject.user.entity.User;
import AgricultureProject.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    public AuthenticationService(UserRepository userRepository,
                                 JwtService jwtService,
                                 AuthenticationManager authenticationManager,
                                 AuditService auditService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public AuthenticationResponseDto login(LoginRequestDto request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            // ✅ At this point in the request there is no authenticated user yet —
            // SecurityContext holds Spring Security's "anonymousUser" principal, not
            // a real one. We already know the email that was attempted, so we pass
            // it explicitly rather than letting AuditService fall back to that
            // anonymous placeholder.
            auditService.logAction(AuditAction.LOGIN_FAILED, "User", null, request.getEmail(), null, null,
                    "Failed login attempt for " + request.getEmail() + " — " + ex.getMessage(),
                    request.getEmail());
            throw ex;
        }

        // ✅ JOIN FETCH guarantees roles are loaded here, inside the transaction.
        User user = userRepository.findByEmailWithRoles(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + request.getEmail()));

        String fullName = user.getFirstName() + " " + user.getLastName();

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            auditService.logAction(AuditAction.LOGIN_FAILED, "User", user.getId(), fullName, null, null,
                    "Login blocked — account status is " + user.getStatus(),
                    user.getEmail());
            throw new IllegalStateException("Account is " + user.getStatus() + ". Please contact administrator.");
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String token = jwtService.generateToken(user);

        // ✅ Same reasoning as above — pass the email we just verified explicitly,
        // rather than reading it back out of a SecurityContext that was never
        // actually populated by this request.
        auditService.logAction(AuditAction.LOGIN_SUCCESS, "User", user.getId(), fullName, null, null,
                "Login successful", user.getEmail());

        return new AuthenticationResponseDto(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roleNames,
                user.getStatus()
        );
    }

    // ✅ JWTs are stateless — this does NOT invalidate the token itself (the client
    // is responsible for discarding it). It exists purely to record a LOGOUT audit
    // event for the currently authenticated user. Unlike login, this endpoint
    // requires a valid JWT, so SecurityContext already holds the real user here —
    // no explicit actor override needed.
    public void logout() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userRepository.findByEmail(email);

        String fullName = user.map(u -> u.getFirstName() + " " + u.getLastName()).orElse(email);

        auditService.logAction(AuditAction.LOGOUT, "User",
                user.map(User::getId).orElse(null), fullName, null, null,
                "User logged out");
    }
}
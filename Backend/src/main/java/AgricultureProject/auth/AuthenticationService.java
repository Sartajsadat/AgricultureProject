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
            // ✅ Failed attempts are audited too — bad password, unknown email, locked account, etc.
            auditService.logAction(AuditAction.LOGIN_FAILED, "User", null, null, null,
                    "Failed login attempt for " + request.getEmail() + " — " + ex.getMessage());
            throw ex;
        }

        // ✅ JOIN FETCH guarantees roles are loaded here, inside the transaction.
        User user = userRepository.findByEmailWithRoles(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + request.getEmail()));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            auditService.logAction(AuditAction.LOGIN_FAILED, "User", user.getId(), null, null,
                    "Login blocked — account status is " + user.getStatus());
            throw new IllegalStateException("Account is " + user.getStatus() + ". Please contact administrator.");
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String token = jwtService.generateToken(user);

        auditService.logAction(AuditAction.LOGIN_SUCCESS, "User", user.getId(), null, null,
                "Login successful");

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
    // event for the currently authenticated user. If you need real server-side
    // token invalidation, that requires a token blacklist/allowlist, which is a
    // separate feature from auditing.
    public void logout() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userRepository.findByEmail(email);

        auditService.logAction(AuditAction.LOGOUT, "User",
                user.map(User::getId).orElse(null), null, null,
                "User logged out");
    }
}
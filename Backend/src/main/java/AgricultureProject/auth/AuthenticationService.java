package AgricultureProject.auth;

import AgricultureProject.security.JwtService;
import AgricultureProject.user.entity.Role;
import AgricultureProject.user.entity.User;
import AgricultureProject.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepository,
                                 JwtService jwtService,
                                 AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional(readOnly = true)
    public AuthenticationResponseDto login(LoginRequestDto request) {
        // Delegates to CustomUserDetailsService + the DaoAuthenticationProvider's PasswordEncoder.
        // Throws BadCredentialsException / DisabledException automatically on failure.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // ✅ JOIN FETCH guarantees roles are loaded here, inside the transaction,
        // so we never hit a LazyInitializationException or a silently empty role set.
        User user = userRepository.findByEmailWithRoles(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found with email: " + request.getEmail()));

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new IllegalStateException("Account is " + user.getStatus() + ". Please contact administrator.");
        }

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String token = jwtService.generateToken(user);

        return new AuthenticationResponseDto(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roleNames,
                user.getStatus()
        );
    }
}

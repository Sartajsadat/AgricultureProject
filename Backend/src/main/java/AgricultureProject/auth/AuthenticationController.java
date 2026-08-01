package AgricultureProject.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    // ✅ The ONLY public endpoint in the app — registration has been removed.
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> login(@RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    // ✅ Requires a valid JWT (protected by default in SecurityConfig).
    // Records a LOGOUT audit event. Does not itself invalidate the JWT — see
    // AuthenticationService.logout() javadoc for why.
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authenticationService.logout();
        return ResponseEntity.ok().build();
    }
}
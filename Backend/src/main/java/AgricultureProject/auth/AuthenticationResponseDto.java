package AgricultureProject.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponseDto {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles; // ✅ all assigned roles, not a single string
    private String status;
}

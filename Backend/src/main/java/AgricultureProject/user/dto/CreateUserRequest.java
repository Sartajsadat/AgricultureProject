package AgricultureProject.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String directorate;
    private String department;
    private String position;
    private String phoneNo;
    private Set<String> roles; // ✅ resolved to Role entities inside UserService
}

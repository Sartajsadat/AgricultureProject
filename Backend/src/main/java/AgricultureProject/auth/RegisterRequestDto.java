package AgricultureProject.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String directorate;
    private String department;
    private String position;
    private String phoneNo;
    // createdBy will be set automatically to the current user or SYSTEM
}
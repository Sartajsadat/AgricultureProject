package AgricultureProject.user.dto;

import AgricultureProject.user.entity.Role;
import AgricultureProject.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String directorate;
    private String department;
    private String position;
    private String phoneNo;
    private String status;
    private Set<String> roles; // ✅ just role names — never the Role entity or its "users" back-reference
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    // ✅ Note: password is intentionally NOT included here.

    public static UserResponseDto from(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponseDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDirectorate(),
                user.getDepartment(),
                user.getPosition(),
                user.getPhoneNo(),
                user.getStatus(),
                roleNames,
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getCreatedBy(),
                user.getUpdatedBy()
        );
    }
}
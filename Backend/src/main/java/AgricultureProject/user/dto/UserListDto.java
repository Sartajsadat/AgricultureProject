package AgricultureProject.user.dto;

import AgricultureProject.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// ✅ Purpose-built for admin "list users" screens — joins User fields with
// full Role objects (id + name), not just role name strings.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserListDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String directorate;
    private String department;
    private String position;
    private String phoneNo;
    private String status;
    private List<RoleDto> roles; // ✅ id + name per role, safe from the Role.users back-reference
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Note: password is intentionally NOT included here.

    public static UserListDto from(User user) {
        List<RoleDto> roleDtos = user.getRoles().stream()
                .map(RoleDto::from)
                .collect(Collectors.toList());

        return new UserListDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDirectorate(),
                user.getDepartment(),
                user.getPosition(),
                user.getPhoneNo(),
                user.getStatus(),
                roleDtos,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}

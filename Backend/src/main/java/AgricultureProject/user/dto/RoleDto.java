package AgricultureProject.user.dto;

import AgricultureProject.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDto {
    private Long id;
    private String name;

    public static RoleDto from(Role role) {
        return new RoleDto(role.getId(), role.getName());
    }
}

package AgricultureProject.user.controller;

import AgricultureProject.user.dto.CreateUserRequestDto;
import AgricultureProject.user.dto.UserListDto;
import AgricultureProject.user.dto.UserResponseDto;
import AgricultureProject.user.entity.User;
import AgricultureProject.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Only users with ADMIN role can access these endpoints

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserListDto>> getAllUsers() {
        List<UserListDto> users = userService.getAllUsers().stream()
                .map(UserListDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(UserResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(UserResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@RequestParam String email) {
        return userService.getUserByEmail(email)
                .map(UserResponseDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody CreateUserRequestDto request) {
        try {
            User created = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(UserResponseDto.from(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updated = userService.updateUser(id, user);
            return ResponseEntity.ok(UserResponseDto.from(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUserStatus(@PathVariable Long id,
                                                            @RequestParam String status) {
        try {
            User user = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(UserResponseDto.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserListDto>> getUsersByStatus(@PathVariable String status) {
        List<UserListDto> users = userService.getUsersByStatus(status).stream()
                .map(UserListDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserListDto>> searchUsers(@RequestParam String query) {
        List<UserListDto> users = userService.searchUsers(query).stream()
                .map(UserListDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // ✅ Admin can (re)assign the full role set
    @PostMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> assignRoles(@PathVariable Long userId,
                                                       @RequestBody Map<String, List<String>> request) {
        try {
            List<String> roleNames = request.get("roles");
            User user = userService.assignRoles(userId, roleNames);
            return ResponseEntity.ok(UserResponseDto.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userId}/roles/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> addRole(@PathVariable Long userId,
                                                   @RequestBody Map<String, String> request) {
        try {
            String roleName = request.get("roleName");
            User user = userService.addRole(userId, roleName);
            return ResponseEntity.ok(UserResponseDto.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}/roles/remove")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> removeRole(@PathVariable Long userId,
                                                      @RequestParam String roleName) {
        try {
            User user = userService.removeRole(userId, roleName);
            return ResponseEntity.ok(UserResponseDto.from(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

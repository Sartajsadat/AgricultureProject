package AgricultureProject.user.service;

import AgricultureProject.audit.entity.AuditAction;
import AgricultureProject.audit.service.AuditService;
import AgricultureProject.user.dto.CreateUserRequestDto;
import AgricultureProject.user.dto.UserResponseDto;
import AgricultureProject.user.entity.Role;
import AgricultureProject.user.entity.User;
import AgricultureProject.user.repository.RoleRepository;
import AgricultureProject.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : "SYSTEM";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByStatus(String status) {
        return userRepository.findByStatus(status);
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByFirstNameContainingOrLastNameContaining(query, query);
    }

    // ✅ Reached only via UserController, locked to ADMIN with @PreAuthorize.
    @Transactional
    public User createUser(CreateUserRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            throw new IllegalArgumentException("At least one role must be specified");
        }

        Set<Role> roles = resolveRoles(request.getRoles());
        String actor = getCurrentUserEmail();

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDirectorate(request.getDirectorate());
        user.setDepartment(request.getDepartment());
        user.setPosition(request.getPosition());
        user.setPhoneNo(request.getPhoneNo());
        user.setStatus("ACTIVE");
        user.setEnabled(true);
        user.setAccountNonLocked(true);
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);
        user.setCreatedBy(actor);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedBy(actor);
        user.setUpdatedAt(LocalDateTime.now());
        user.setRoles(roles);

        User saved = userRepository.save(user);

        auditService.logCreate("User", saved.getId(), UserResponseDto.from(saved),
                "User created by " + actor);

        return saved;
    }

    // ✅ Captures a full snapshot BEFORE any field is touched, tracks exactly which
    // fields actually changed, and logs old vs. new after saving.
    @Transactional
    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        UserResponseDto oldSnapshot = UserResponseDto.from(existingUser);
        List<String> changedFields = new ArrayList<>();
        String actor = getCurrentUserEmail();

        if (userDetails.getFirstName() != null && !Objects.equals(userDetails.getFirstName(), existingUser.getFirstName())) {
            existingUser.setFirstName(userDetails.getFirstName());
            changedFields.add("firstName");
        }
        if (userDetails.getLastName() != null && !Objects.equals(userDetails.getLastName(), existingUser.getLastName())) {
            existingUser.setLastName(userDetails.getLastName());
            changedFields.add("lastName");
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new IllegalArgumentException("Email already exists: " + userDetails.getEmail());
            }
            existingUser.setEmail(userDetails.getEmail());
            changedFields.add("email");
        }
        if (userDetails.getDirectorate() != null && !Objects.equals(userDetails.getDirectorate(), existingUser.getDirectorate())) {
            existingUser.setDirectorate(userDetails.getDirectorate());
            changedFields.add("directorate");
        }
        if (userDetails.getDepartment() != null && !Objects.equals(userDetails.getDepartment(), existingUser.getDepartment())) {
            existingUser.setDepartment(userDetails.getDepartment());
            changedFields.add("department");
        }
        if (userDetails.getPosition() != null && !Objects.equals(userDetails.getPosition(), existingUser.getPosition())) {
            existingUser.setPosition(userDetails.getPosition());
            changedFields.add("position");
        }
        if (userDetails.getPhoneNo() != null && !Objects.equals(userDetails.getPhoneNo(), existingUser.getPhoneNo())) {
            existingUser.setPhoneNo(userDetails.getPhoneNo());
            changedFields.add("phoneNo");
        }

        existingUser.setUpdatedBy(actor);
        existingUser.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(existingUser);

        if (!changedFields.isEmpty()) {
            auditService.logUpdate("User", id, oldSnapshot, UserResponseDto.from(saved),
                    "Updated by " + actor + " — changed: " + String.join(", ", changedFields));
        }

        return saved;
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        UserResponseDto snapshot = UserResponseDto.from(user);
        String actor = getCurrentUserEmail();

        userRepository.delete(user);

        auditService.logDelete("User", id, snapshot, "User deleted by " + actor);
    }

    @Transactional
    public User updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        String oldStatus = user.getStatus();
        String actor = getCurrentUserEmail();

        user.setStatus(status);
        user.setUpdatedBy(actor);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        auditService.logAction(AuditAction.STATUS_CHANGE, "User", id,
                Map.of("status", oldStatus), Map.of("status", status),
                "Status changed from " + oldStatus + " to " + status + " by " + actor);

        return saved;
    }

    @Transactional
    public User assignRoles(Long userId, List<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Set<String> oldRoles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        Set<Role> roles = resolveRoles(new HashSet<>(roleNames));
        String actor = getCurrentUserEmail();

        user.getRoles().clear();
        user.getRoles().addAll(roles);
        user.setUpdatedBy(actor);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        Set<String> newRoles = roles.stream().map(Role::getName).collect(Collectors.toSet());
        auditService.logAction(AuditAction.ROLE_ASSIGNED, "User", userId, oldRoles, newRoles,
                "Roles reassigned by " + actor);

        return saved;
    }

    @Transactional
    public User addRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Set<String> oldRoles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        Role role = findRoleByName(roleName);
        String actor = getCurrentUserEmail();

        user.getRoles().add(role);
        user.setUpdatedBy(actor);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        Set<String> newRoles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        auditService.logAction(AuditAction.ROLE_ASSIGNED, "User", userId, oldRoles, newRoles,
                "Role '" + role.getName() + "' added by " + actor);

        return saved;
    }

    @Transactional
    public User removeRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Set<String> oldRoles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        Role role = findRoleByName(roleName);
        String actor = getCurrentUserEmail();

        user.getRoles().remove(role);
        user.setUpdatedBy(actor);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        Set<String> newRoles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        auditService.logAction(AuditAction.ROLE_REMOVED, "User", userId, oldRoles, newRoles,
                "Role '" + role.getName() + "' removed by " + actor);

        return saved;
    }

    // ✅ Self-service: authenticated user changes THEIR OWN password.
    // Resolves the target user from the SecurityContext — never from a
    // client-supplied id — so nobody can change someone else's password
    // through this endpoint.
    @Transactional
    public void changeOwnPassword(String oldPassword, String newPassword) {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        validateNewPassword(newPassword);

        applyNewPassword(user, newPassword);
        auditService.logAction(AuditAction.PASSWORD_CHANGED, "User", user.getId(), null, null,
                "Password changed by " + email);
    }

    // ✅ Admin action: caller already knows the target id and doesn't need
    // (or know) the old password. Guarded by @PreAuthorize in the controller.
    @Transactional
    public void resetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        validateNewPassword(newPassword);

        String actor = getCurrentUserEmail();
        applyNewPassword(user, newPassword);

        auditService.logAction(AuditAction.PASSWORD_RESET, "User", userId, null, null,
                "Password reset by " + actor);
    }

    private void validateNewPassword(String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
    }

    private void applyNewPassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedBy(getCurrentUserEmail());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // ✅ Single place that turns role names into managed Role entities.
    private Set<Role> resolveRoles(Set<String> roleNames) {
        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            roles.add(findRoleByName(roleName));
        }
        return roles;
    }

    private Role findRoleByName(String roleName) {
        return roleRepository.findByName(roleName.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleName));
    }
}
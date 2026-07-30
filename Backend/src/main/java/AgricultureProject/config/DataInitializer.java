package AgricultureProject.config;

import AgricultureProject.user.entity.Role;
import AgricultureProject.user.entity.User;
import AgricultureProject.user.repository.RoleRepository;
import AgricultureProject.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@ss.com";
    private static final String ADMIN_DEFAULT_PASSWORD = "123456";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Role adminRole = ensureRoleExists("ADMIN");
        ensureRoleExists("USER");
        ensureDefaultAdminExists(adminRole);
    }

    private Role ensureRoleExists(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private void ensureDefaultAdminExists(Role adminRole) {
        Optional<User> existingAdmin = userRepository.findByEmailWithRoles(ADMIN_EMAIL);

        if (existingAdmin.isPresent()) {
            // ✅ Self-heals a row that was previously created (e.g. by older code)
            // without the ADMIN role properly linked.
            User admin = existingAdmin.get();
            if (!admin.getRoles().contains(adminRole)) {
                admin.getRoles().add(adminRole);
                userRepository.save(admin);
            }
            return;
        }

        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("System");
        admin.setEmail(ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode(ADMIN_DEFAULT_PASSWORD));
        admin.setDirectorate("IT");
        admin.setDepartment("Administration");
        admin.setPosition("System Administrator");
        admin.setPhoneNo("+1234567890");
        admin.setStatus("ACTIVE");
        admin.setEnabled(true);
        admin.setAccountNonLocked(true);
        admin.setAccountNonExpired(true);
        admin.setCredentialsNonExpired(true);
        admin.setCreatedBy("SYSTEM");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedBy("SYSTEM");
        admin.setUpdatedAt(LocalDateTime.now());

        // ✅ The default admin gets ONLY the ADMIN role — USER is never assigned here.
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);
        admin.setRoles(roles);

        userRepository.save(admin);
    }
}

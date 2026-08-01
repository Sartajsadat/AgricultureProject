package AgricultureProject.user.controller;

import AgricultureProject.user.dto.RoleDto;
import AgricultureProject.user.entity.Role;
import AgricultureProject.user.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // ✅ Admin-only: list every role currently in the system
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = roleRepository.findAll().stream()
                .map(RoleDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    // ✅ Admin-only: create a new role
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDto> createRole(@RequestBody Map<String, String> body) {
        String rawName = body.get("name");
        if (rawName == null || rawName.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String name = rawName.trim().toUpperCase();
        if (roleRepository.existsByName(name)) {
            return ResponseEntity.badRequest().build();
        }

        Role saved = roleRepository.save(new Role(name));
        return ResponseEntity.status(HttpStatus.CREATED).body(RoleDto.from(saved));
    }
}
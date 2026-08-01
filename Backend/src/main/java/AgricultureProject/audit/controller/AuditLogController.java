package AgricultureProject.audit.controller;

import AgricultureProject.audit.dto.AuditLogResponseDto;
import AgricultureProject.audit.entity.AuditAction;
import AgricultureProject.audit.entity.AuditLog;
import AgricultureProject.audit.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // ✅ Admin-only. Filter by any one of entityType+entityId / action / performedBy,
    // or leave all blank for the full paginated log.
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLogResponseDto>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) String performedBy,
            @PageableDefault(size = 20, sort = "performedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<AuditLog> logs;
        if (entityType != null && entityId != null) {
            logs = auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable);
        } else if (action != null) {
            logs = auditLogRepository.findByAction(action, pageable);
        } else if (performedBy != null) {
            logs = auditLogRepository.findByPerformedBy(performedBy, pageable);
        } else {
            logs = auditLogRepository.findAll(pageable);
        }

        return ResponseEntity.ok(logs.map(AuditLogResponseDto::from));
    }

    // ✅ Convenience shortcut: the complete history for one specific user —
    // every create/update/delete/status/role/login/logout event tied to them.
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLogResponseDto>> getUserAuditTrail(
            @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "performedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<AuditLog> logs = auditLogRepository.findByEntityTypeAndEntityId("User", userId, pageable);
        return ResponseEntity.ok(logs.map(AuditLogResponseDto::from));
    }
}
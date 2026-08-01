package AgricultureProject.audit.dto;

import AgricultureProject.audit.entity.AuditAction;
import AgricultureProject.audit.entity.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponseDto {
    private Long id;
    private String entityType;
    private Long entityId;
    private AuditAction action;
    private String performedBy;
    private LocalDateTime performedAt;
    private String oldValue;
    private String newValue;
    private String description;
    private String ipAddress;
    private String userAgent;

    public static AuditLogResponseDto from(AuditLog log) {
        return new AuditLogResponseDto(
                log.getId(),
                log.getEntityType(),
                log.getEntityId(),
                log.getAction(),
                log.getPerformedBy(),
                log.getPerformedAt(),
                log.getOldValue(),
                log.getNewValue(),
                log.getDescription(),
                log.getIpAddress(),
                log.getUserAgent()
        );
    }
}
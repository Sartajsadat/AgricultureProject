package AgricultureProject.audit.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String entityType; // e.g. "User"

    private Long entityId; // nullable — e.g. LOGIN_FAILED for an email that doesn't exist

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AuditAction action;

    @Column(nullable = false)
    private String performedBy; // actor's email, or "SYSTEM"

    @Column(nullable = false)
    private LocalDateTime performedAt;

    @Column(columnDefinition = "TEXT")
    private String oldValue; // JSON snapshot BEFORE the change

    @Column(columnDefinition = "TEXT")
    private String newValue; // JSON snapshot AFTER the change

    @Column(columnDefinition = "TEXT")
    private String description; // human-readable summary, e.g. "changed: email, phoneNo"

    private String ipAddress;

    @Column(length = 500)
    private String userAgent;
}

package AgricultureProject.audit.service;

import AgricultureProject.audit.entity.AuditAction;
import AgricultureProject.audit.entity.AuditLog;
import AgricultureProject.audit.repository.AuditLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditService(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    // ✅ REQUIRES_NEW: audit writes commit independently of whatever business
    // transaction triggered them — a rollback in the caller doesn't erase the
    // audit trail, and a read-only caller (like login) can still write here.

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logCreate(String entityType, Long entityId, Object newValue, String description) {
        persist(AuditAction.CREATE, entityType, entityId, null, newValue, description);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUpdate(String entityType, Long entityId, Object oldValue, Object newValue, String description) {
        persist(AuditAction.UPDATE, entityType, entityId, oldValue, newValue, description);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logDelete(String entityType, Long entityId, Object oldValue, String description) {
        persist(AuditAction.DELETE, entityType, entityId, oldValue, null, description);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(AuditAction action, String entityType, Long entityId,
                          Object oldValue, Object newValue, String description) {
        persist(action, entityType, entityId, oldValue, newValue, description);
    }

    private void persist(AuditAction action, String entityType, Long entityId,
                         Object oldValue, Object newValue, String description) {
        try {
            AuditLog entry = new AuditLog();
            entry.setEntityType(entityType);
            entry.setEntityId(entityId);
            entry.setAction(action);
            entry.setPerformedBy(currentActor());
            entry.setPerformedAt(LocalDateTime.now());
            entry.setOldValue(toJson(oldValue));
            entry.setNewValue(toJson(newValue));
            entry.setDescription(description);
            entry.setIpAddress(currentIp());
            entry.setUserAgent(currentUserAgent());
            auditLogRepository.save(entry);
        } catch (Exception e) {
            // ✅ Auditing must never break the operation it's observing
            log.error("Failed to write audit log [{} {} #{}]: {}", action, entityType, entityId, e.getMessage());
        }
    }

    private String currentActor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (authentication != null && authentication.isAuthenticated())
                ? authentication.getName()
                : "SYSTEM";
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.warn("Could not serialize audit payload: {}", e.getMessage());
            return null;
        }
    }

    private String currentIp() {
        HttpServletRequest request = currentRequest();
        if (request == null) {
            return null;
        }
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String currentUserAgent() {
        HttpServletRequest request = currentRequest();
        return request != null ? request.getHeader("User-Agent") : null;
    }

    private HttpServletRequest currentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }
}
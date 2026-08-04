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
    //
    // entityLabel: a human-readable name for whatever entityId points to
    // (e.g. "Ali Ahmad") — captured at the moment of the action, since the
    // caller always has it in hand right then. This is what the UI shows
    // instead of a bare "#42".

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logCreate(String entityType, Long entityId, String entityLabel, Object newValue, String description) {
        persist(AuditAction.CREATE, entityType, entityId, entityLabel, null, newValue, description, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUpdate(String entityType, Long entityId, String entityLabel,
                          Object oldValue, Object newValue, String description) {
        persist(AuditAction.UPDATE, entityType, entityId, entityLabel, oldValue, newValue, description, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logDelete(String entityType, Long entityId, String entityLabel, Object oldValue, String description) {
        persist(AuditAction.DELETE, entityType, entityId, entityLabel, oldValue, null, description, null);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(AuditAction action, String entityType, Long entityId, String entityLabel,
                          Object oldValue, Object newValue, String description) {
        persist(action, entityType, entityId, entityLabel, oldValue, newValue, description, null);
    }

    // ✅ Explicit-actor variant: for events where SecurityContext doesn't
    // (yet) hold the real user — most notably login itself, where the
    // request is still anonymous from Spring Security's point of view right
    // up until authentication succeeds. Callers that already know exactly
    // who this is about (AuthenticationService does) pass the email directly
    // instead of relying on currentActor().
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(AuditAction action, String entityType, Long entityId, String entityLabel,
                          Object oldValue, Object newValue, String description, String actorOverride) {
        persist(action, entityType, entityId, entityLabel, oldValue, newValue, description, actorOverride);
    }

    private void persist(AuditAction action, String entityType, Long entityId, String entityLabel,
                         Object oldValue, Object newValue, String description, String actorOverride) {
        try {
            AuditLog entry = new AuditLog();
            entry.setEntityType(entityType);
            entry.setEntityId(entityId);
            entry.setEntityLabel(entityLabel);
            entry.setAction(action);
            entry.setPerformedBy(actorOverride != null ? actorOverride : currentActor());
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
        // ✅ Spring Security's AnonymousAuthenticationFilter gives unauthenticated
        // requests a real (but fake) principal named "anonymousUser" — without this
        // check that string would get written to the audit log as if it were a person.
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            return "SYSTEM";
        }
        return authentication.getName();
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
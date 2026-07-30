package AgricultureProject.user.repository;

import AgricultureProject.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ JOIN FETCH guarantees roles are loaded in the same query.
    // Used by CustomUserDetailsService and AuthenticationService — anywhere
    // roles must be reliably populated (e.g. before leaving a transaction,
    // or before generating a JWT).
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByStatus(String status);
    List<User> findByCreatedBy(String createdBy);
    List<User> findByStatusAndEnabledTrue(String status);
    List<User> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
}

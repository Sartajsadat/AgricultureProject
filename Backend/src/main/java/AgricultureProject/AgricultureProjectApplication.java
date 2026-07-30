package AgricultureProject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class AgricultureProjectApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(AgricultureProjectApplication.class);
		Environment env = app.run(args).getEnvironment();

		String port = env.getProperty("server.port");
		String contextPath = env.getProperty("server.servlet.context-path", "");

		System.out.println("╔═══════════════════════════════════════════════════════════════════════╗");
		System.out.println("║                                                                       ║");
		System.out.println("║   🚀 AGRICULTURE PROJECT BACKEND STARTED SUCCESSFULLY!                ║");
		System.out.println("║                                                                       ║");
		System.out.println("║   📍 Server running on: http://localhost:" + port + contextPath + "      ║");
		System.out.println("║   🔑 Authentication API: http://localhost:" + port + "/api/auth/login   ║");
		System.out.println("║   👤 Admin Email: admin@ss.com                                       ║");
		System.out.println("║   🔒 Admin Password: 123456                                           ║");
		System.out.println("║                                                                       ║");
		System.out.println("║   ✅ Ready to accept requests!                                        ║");
		System.out.println("║                                                                       ║");
		System.out.println("╚═══════════════════════════════════════════════════════════════════════╝");
	}
}
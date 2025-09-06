# EcoFinds - Sustainable Second-Hand Marketplace

A hackathon project for a sustainable second-hand marketplace with user authentication system.

## Features

- **User Authentication**: Login and Sign-up with email validation
- **Responsive Design**: Mobile-first approach with eco-friendly color scheme
- **Clean UI**: Modern, intuitive interface following wireframe specifications
- **Enhanced UX**: Input field icons, password visibility toggle, forgot password link
- **Strong Password Requirements**: Uppercase, lowercase, numbers, special characters
- **Real-time Validation**: Live password strength indicator and form validation
- **Security**: Password hashing with BCrypt
- **Database Integration**: MySQL with JPA/Hibernate
- **REST API**: Spring Boot backend with proper error handling

## Tech Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, responsive design, animations
- **Vanilla JavaScript**: No frameworks, clean and modular code

### Backend
- **Java 17+**: Modern Java features
- **Spring Boot 3.x**: Rapid application development
- **Spring Data JPA**: Database abstraction
- **MySQL**: Relational database
- **BCrypt**: Secure password hashing

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE ecofinds;
   ```

2. **Run Schema Script**:
   ```bash
   mysql -u root -p ecofinds < src/main/resources/sql/schema.sql
   ```

3. **Update Database Configuration** (if needed):
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ecofinds?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password_here
   ```

### Application Setup

1. **Clone/Download the project**

2. **Install Dependencies**:
   ```bash
   mvn clean install
   ```

3. **Run the Application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access the Application**:
   - Open browser and go to: `http://localhost:8080`
   - The authentication page will be displayed

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/health` - Health check

### Web Pages
- `GET /` - Redirects to auth page
- `GET /auth` - Authentication page
- `GET /dashboard` - User dashboard (after login)

## Project Structure

```
src/
├── main/
│   ├── java/com/hitarth/odoo/
│   │   ├── controller/          # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── model/              # Entity models
│   │   ├── dto/                # Data transfer objects
│   │   ├── config/             # Configuration classes
│   │   └── OdooApplication.java
│   └── resources/
│       ├── templates/
│       │   ├── html/           # HTML pages
│       │   ├── css/            # Stylesheets
│       │   └── js/             # JavaScript files
│       ├── sql/                # Database scripts
│       └── application.properties
```

## Design Features

### Color Scheme
- **Primary Green**: #4CAF50 (buttons, accents)
- **Secondary Green**: #8BC34A (hover states)
- **Background**: #F5F5F5 (light gray)
- **Text**: #333333 (dark gray)
- **Error**: #f44336 (red)

### UX Enhancements
- **Input Field Icons**: 📧 for email, 🔒 for password, 👤 for username
- **Password Visibility Toggle**: 👁 Show/Hide password functionality
- **Forgot Password Link**: UI-level implementation with validation
- **Enhanced Button Hover**: Subtle darkening effect on hover
- **Real-time Password Strength**: Live checklist with visual indicators
- **Smooth Animations**: Transitions and hover effects throughout

### Responsive Design
- **Desktop**: Centered form, max-width 400px
- **Mobile**: Full-width, stacked layout
- **Breakpoints**: 480px, 360px

### Accessibility
- Semantic HTML elements
- ARIA labels for form inputs and buttons
- Keyboard navigation support
- High contrast mode support
- Reduced motion support
- Screen reader friendly password toggle

## Validation Rules

### Registration
- **Display Name**: 3-100 characters, required
- **Email**: Valid email format, unique, required
- **Password**: Strong password required with:
  - Minimum 8 characters
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*)

### Login
- **Email/Username**: Required
- **Password**: Required

## Security Features

- Password hashing with BCrypt
- Input validation and sanitization
- SQL injection prevention (JPA)
- CORS configuration
- Error handling without sensitive data exposure

## Testing the Application

### Sample Users
The database includes sample users for testing:
- **Email**: test@ecofinds.com, **Password**:   password123
- **Email**: green@ecofinds.com, **Password**: password123

### Test Scenarios
1. **Registration**: Create new account with valid data
2. **Login**: Authenticate with existing credentials
3. **Validation**: Test with invalid data to see error messages
4. **Password Strength**: Test password requirements with real-time feedback
5. **Responsive**: Test on different screen sizes

### Example Strong Passwords
- `EcoFinds123!`
- `GreenShop456@`
- `TestPass789#`
- `SecurePwd2024$`

## Development Notes

- Uses vanilla JavaScript (no frameworks)
- Modular CSS with custom properties
- Clean separation of concerns
- Proper error handling and user feedback
- Loading states and animations
- Form validation with real-time feedback

## Future Enhancements

- Session management with JWT tokens
- Email verification for registration
- Password reset functionality
- User profile management
- Item listing and browsing
- Search and filtering
- Shopping cart functionality
- Payment integration

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Check database credentials in application.properties
   - Verify database exists

2. **Port Already in Use**:
   - Change server.port in application.properties
   - Or stop other applications using port 8080

3. **Static Resources Not Loading**:
   - Check WebConfig.java for resource handlers
   - Verify file paths in HTML

4. **CORS Issues**:
   - Check @CrossOrigin annotation in controllers
   - Verify CORS configuration in application.properties

## License

This project is created for hackathon purposes. Feel free to use and modify as needed.

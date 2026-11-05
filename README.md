# 🏡 Wanderlust – Full-Stack Stay Listing Web Application

A full-stack web application inspired by Airbnb that allows users to explore accommodation listings, search destinations, view locations on interactive maps, share reviews, and publish their own properties.

Built using **Node.js, Express.js, MongoDB, and EJS**, this project demonstrates practical implementation of backend development, database management, authentication, authorization, cloud image storage, and responsive frontend design.

## 🌐 Project Links

- **Live Demo:** Add your deployed Render URL
- **GitHub:** [VeNumadhaV66](https://github.com/VeNumadhaV66)
- **LinkedIn:** [Talari Venumadhava](https://www.linkedin.com/in/talari-venu-madhava-66751b280/)

## ✨ Key Features

### 🏠 Listing Management
- Browse accommodation listings with a responsive card layout.
- Create, edit, and delete property listings.
- Upload property images with image preview functionality.
- Display listing details, pricing, location, and descriptions.
- Automatically manage associated reviews when deleting listings.

### 🔍 Search and Discovery
- Search listings by title, location, and country.
- Explore listings through multiple categories.
- Interactive category filters with icons.
- Display total prices including applicable taxes.

### 🔐 Authentication and Authorization
- User registration, login, and logout.
- Secure password hashing and salting.
- Session-based authentication using Passport.js.
- Protected routes using custom middleware.
- Ownership-based authorization for listing modifications.
- Review-author authorization for review deletion.

### ⭐ Reviews and Ratings
- Add reviews with ratings from 1 to 5 stars.
- Display user comments and ratings.
- Calculate average listing ratings.
- Restrict review deletion to the original author.

### 🗺️ Interactive Maps
- Display listing locations using Leaflet.js.
- Integrate OpenStreetMap for map visualization.
- Convert location names into geographical coordinates using Nominatim.

### ☁️ Cloud Integration
- Upload and manage images using Cloudinary.
- Automatically remove replaced or deleted cloud images.
- Store application data in MongoDB Atlas.
- Deploy the application using Render.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Template Engine | EJS, ejs-mate |
| Authentication | Passport.js, passport-local |
| Session Management | express-session, connect-mongo |
| Validation | Joi, HTML5 Validation |
| Image Upload | Multer, Cloudinary |
| Maps | Leaflet.js, OpenStreetMap |
| Geocoding | OpenStreetMap Nominatim |
| Development Tools | VS Code, Git, GitHub, Nodemon |
| Deployment | Render, MongoDB Atlas, Cloudinary |

## 🏗️ Application Architecture

This application follows the **Model-View-Controller (MVC)** architectural pattern.

- **Models:** Define database schemas and manage application data using Mongoose.
- **Views:** Render dynamic user interfaces using EJS templates.
- **Controllers:** Handle application logic and process user requests.
- **Routes:** Define application endpoints and connect them with middleware and controllers.
- **Middleware:** Handle authentication, authorization, and data validation.

### Application Workflow

1. Users interact with the frontend through the browser.
2. Express.js receives HTTP requests.
3. Middleware handles authentication and validation.
4. Controllers process application logic.
5. Mongoose communicates with MongoDB.
6. Cloudinary manages uploaded images.
7. EJS renders dynamic pages and returns responses to users.

## 🔒 Security and Validation

Security and data integrity are important parts of this application.

- Passwords are protected using hashing and salting.
- Authentication and authorization are implemented separately.
- Protected routes prevent unauthorized modifications.
- Server-side validation is implemented using Joi.
- Sessions are stored in MongoDB.
- Signed cookies protect stored cookie data against tampering.
- Environment variables keep sensitive credentials outside the source code.
- Image uploads are restricted by file type and size.
- Error-handling middleware manages application errors.

## 🚀 Deployment

The application uses the following cloud services:

| Service | Purpose |
|---|---|
| Render | Application hosting |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image storage |

## 📚 Key Learning Outcomes

Developing this project helped me gain practical experience in:

- Building full-stack web applications using the MVC architecture.
- Developing RESTful routes and backend APIs.
- Performing CRUD operations using Express.js and MongoDB.
- Implementing authentication and authorization using Passport.js.
- Designing and managing database schemas and relationships.
- Handling image uploads and cloud storage integration.
- Implementing server-side validation and centralized error handling.
- Working with sessions, cookies, and middleware.
- Integrating third-party services and interactive maps.
- Managing environment variables and deploying applications.
- Debugging real-world development issues and organizing scalable project structures.

## 🔮 Future Enhancements

- [ ] Implement property booking and availability management.
- [ ] Integrate secure online payment functionality.
- [ ] Add a wishlist and favorite listings feature.
- [ ] Develop a host dashboard.
- [ ] Implement automated testing.
- [ ] Add email notifications.
- [ ] Improve search with pagination and advanced filters.

## 👨‍💻 About the Developer

**Talari Venumadhava**

Computer Science Graduate | Aspiring Software Developer

Passionate about software development, problem-solving, and building practical applications using modern web technologies.

- **GitHub:** [VeNumadhaV66](https://github.com/VeNumadhaV66)
- **LinkedIn:** [Talari Venumadhava](https://www.linkedin.com/in/talari-venu-madhava-66751b280/)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

⭐ If you find this project interesting, feel free to explore the repository and share your feedback.

**Built with dedication and continuous learning.**
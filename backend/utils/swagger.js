const m2s = require('mongoose-to-swagger');
const Upload = require('../models/upload.model')
const Post = require('../models/post.model')
const SubPage = require('../models/subPage.model')
const Admin = require('../models/admins.models')
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "blog and dashboard",
      description: "basic dahshboard",
    },
    components: {
      schemas: {
        Admin: m2s (Admin),
        uploads: m2s(Upload),
        Post: m2s(Post),
        SubPage: m2s(SubPage)
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
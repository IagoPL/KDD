const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

const request = require("supertest");
const app = require("../app"); // Aplicación Express
const mongoose = require("mongoose");
const connectDB = require("../config/database");

// Variables globales para las pruebas
let token;
let groupId;

beforeAll(async () => {
    // Conectar a la base de datos de pruebas
    await connectDB();
});

afterAll(async () => {
    // Cerrar la conexión después de las pruebas
    await mongoose.connection.close();
});

describe("Autenticación", () => {
    it("Debe registrar un usuario nuevo", async () => {
        const res = await request(app)
            .post("/api/users/signup")
            .send({ email: "test@exampqwele123.com", password: "123456" });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("userId");
    });

    it("Debe iniciar sesión con credenciales válidas", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@example.com", password: "123456" });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token; // Guardar el token para pruebas posteriores
    });
});

describe("Grupos", () => {
    it("Debe crear un grupo nuevo", async () => {
        const res = await request(app)
            .post("/api/groups/create")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Mi Grupo" });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("group");
        groupId = res.body.group._id; // Guardar el ID del grupo para pruebas posteriores
    });

    it("Debe obtener los grupos del usuario", async () => {
        const res = await request(app)
            .get("/api/groups/mygroups")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("Debe añadir un miembro al grupo", async () => {
        // Registrar un nuevo usuario para añadir al grupo
        const newUser = await request(app)
            .post("/api/users/signup")
            .send({ email: "newuser@example.com", password: "123456" });

        console.log({ groupId, userId: newUser.body.userId }); // Para depuración

        // Validar que userId no sea undefined
        expect(newUser.body.userId).toBeDefined();

        const res = await request(app)
            .post("/api/groups/add-member")
            .set("Authorization", `Bearer ${token}`)
            .send({ groupId, userId: newUser.body.userId });

        // Validar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Miembro añadido con éxito");
    });
});

describe("Llamadas", () => {
    let roomId;

    it("Debe crear una sala nueva", async () => {
        const res = await request(app)
            .post("/api/calls/create")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("roomId");
        roomId = res.body.roomId;
    });

    it("Debe unirse a una sala existente", async () => {
        const res = await request(app)
            .post("/api/calls/join")
            .set("Authorization", `Bearer ${token}`)
            .send({ roomId });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Unido a la sala");
    });

    it("Debe devolver un error si la sala no existe", async () => {
        const res = await request(app)
            .post("/api/calls/join")
            .set("Authorization", `Bearer ${token}`)
            .send({ roomId: "sala-inexistente" });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error", "Sala no encontrada");
    });
});

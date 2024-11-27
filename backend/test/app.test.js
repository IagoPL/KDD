require("dotenv").config({ path: "./.env.test" });

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

let token; // Para almacenar el token de autenticación
let roomId; // Para almacenar el ID de la sala creada

beforeAll(async () => {
    // Conectar a la base de datos de prueba
    await mongoose.connect(process.env.TEST_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Desconectar de la base de datos
    await mongoose.disconnect();
});

describe("Autenticación", () => {
    it("Debe registrar un usuario nuevo", async () => {
        const res = await request(app)
            .post("/api/users/signup")
            .send({ email: "test@example1asd23.com", password: "123456" });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("userId");
        expect(res.body).toHaveProperty("token");
        token = res.body.token; // Guardar el token para pruebas posteriores
    });

    it("Debe iniciar sesión con credenciales válidas", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({ email: "test@example1asd23.com", password: "123456" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token; // Guardar el token para pruebas posteriores
    });
});

describe("Llamadas", () => {
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

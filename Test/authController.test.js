const request = require("supertest");
const app = require("../index");

let server;

beforeAll(() => {
    server = app.listen(3000); 
});

afterAll(() => {
    server.close();
});

describe(" Vérifier Routes API " , () => {
    describe('API Signin',()=>{
        test("Vérifier la connexion réussie avec des identifiants valides - POST /auth/signin", async () => {
            const user = {
                usernameOrEmail: "ali@gmail.com",
                motdepasse: "123456789"
            };
    
            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
        });
        test('Vérifier la réponse lorsque le mot de passe est incorrect. il doit return un msg err POST /auth/singnin',async ()=>{
            const user={
                usernameOrEmail: "ali@gmail.com",
                motdepasse: "12345678910"
            }
            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid username or password')
        })
        test('Vérifier la reponse lorsque un champ manque . il doit return un msg err POST /auth/singnin',async ()=>{
            const user={
                usernameOrEmail: "ali@gmail.com",
            }
            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username or email and password are required!');
        })
    
    })
    describe('API signup',()=>{
        test('Verifier une utilisateur avec des champs valid retourne une un msg user create avec succes ', async()=>{
            
            const user={
                username:"said9000",
                nom:"said2",
                prenom:"nichan",
                email: "said7877794884@gmail.com",
                motdepasse: "12345678910"
            }
            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        })
        test( ' Verifier si un champ et deja exist email or username ',async()=>{
            const user = {
                username:"said123",
                nom:"said",
                prenom:"nichan",
                email: "said10@gmail.com",
                motdepasse: "12345678910"
            } 
            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username or email already exists');
        })
        test(' Verfier si un champs absent return msg username && email && modepasse are required !!! ',async()=>{
            const user={
                username : 'ssss',
                nom :"said",
                prenom :"nichan",
                email : "saidnichan@gmail.com"
              // manque mode pass 
            }
            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(401);
            expect(response.body.msg).toBe('username && email && modepasse are required !!!');
        })
    })  
});

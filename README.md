# API de Gerenciamento

Esta é uma API de gerenciamento construída com Node.js utilizando o framework Express. Ela fornece endpoints para manipulação de usuários, serviços, funcionários, horários de funcionamento e horários indisponíveis dos funcionários.

## Configuração

Certifique-se de ter o Node.js instalado em seu ambiente de desenvolvimento.

1. Faça o clone deste repositório.
2. No diretório raiz do projeto, execute o comando `npm install` para instalar as dependências.
3. Configure as variáveis de ambiente no arquivo `.env`, se necessário.
4. Execute o comando `npm start` para iniciar o servidor.

A API estará disponível em `http://localhost:3000`.

## Rotas

A API possui as seguintes rotas:

### Usuários

- **GET /user**: Retorna todos os usuários cadastrados.
- **GET /user/:id**: Retorna as informações do usuário com o ID fornecido.
- **POST /user**: Cria um novo usuário com base nos dados fornecidos.
- **PUT /user/:id**: Atualiza as informações do usuário com o ID fornecido.
- **DELETE /user/:id**: Remove o usuário com o ID fornecido.

### Serviços

- **GET /servicing**: Retorna todos os serviços cadastrados.
- **GET /servicing/:id**: Retorna as informações do serviço com o ID fornecido.
- **POST /servicing**: Cria um novo serviço com base nos dados fornecidos.
- **PUT /servicing/:id**: Atualiza as informações do serviço com o ID fornecido.
- **DELETE /servicing/:id**: Remove o serviço com o ID fornecido.

### Funcionários

- **GET /employees**: Retorna todos os funcionários cadastrados.
- **GET /employees/:id**: Retorna as informações do funcionário com o ID fornecido.
- **POST /employees**: Cria um novo funcionário com base nos dados fornecidos.
- **PUT /employees/:id**: Atualiza as informações do funcionário com o ID fornecido.
- **DELETE /employees/:id**: Remove o funcionário com o ID fornecido.

### Agendamentos

- **GET /schedules**: Retorna todos os agendamentos cadastrados.
- **GET /schedules/:id**: Retorna as informações do agendamento com o ID fornecido.
- **POST /schedules**: Cria um novo agendamento com base nos dados fornecidos.
- **PUT /schedules/:id**: Atualiza as informações do agendamento com o ID fornecido.
- **DELETE /schedules/:id**: Remove o agendamento com o ID fornecido.

### Horários de Funcionamento

- **GET /opening_hours**: Retorna os horários de funcionamento cadastrados.
- **GET /opening_hours/:id**: Retorna as informações do horário de funcionamento com o ID fornecido.
- **POST /opening_hours**: Cria um novo horário de funcionamento com base nos dados fornecidos.
- **PUT /opening_hours/:id**: Atualiza as informações do horário de funcionamento com o ID fornecido.
- **DELETE /opening_hours/:id**: Remove o horário de funcionamento com o ID fornecido.

### Horários Indisponíveis dos Funcionários

- **GET /employees_unavailable**: Retorna os horários indisponíveis dos funcionários cadastrados.
- **GET /employees_unavailable/:id**: Retorna as informações do horário indisponível do funcion

ário com o ID fornecido.

- **POST /employees_unavailable**: Cria um novo horário indisponível do funcionário com base nos dados fornecidos.
- **PUT /employees_unavailable/:id**: Atualiza as informações do horário indisponível do funcionário com o ID fornecido.
- **DELETE /employees_unavailable/:id**: Remove o horário indisponível do funcionário com o ID fornecido.

## Exemplos de Uso

### Criar um usuário

**Requisição:**

```http
POST /user
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "secretpassword"
}
```

**Resposta:**

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "1",
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### Obter informações de um serviço

**Requisição:**

```http
GET /servicing/1
```

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "1",
  "name": "Haircut",
  "price": 25.0
}
```

## Contribuição

Se desejar contribuir para este projeto, sinta-se à vontade para enviar um pull request. Ficaremos felizes em revisar e incorporar as melhorias.

## Desafio 01 do Ignite

Essa será uma aplicação para gerenciar tarefas (*todos*).

### Features

- Criar um novo *usuário*: (POST /users);
- Criar um novo *todo*: (POST /todos);
- Listar todos os *todos*: (GET /todos);
- Alterar o `title` e `deadline` de um *todo* existente: (PUT /todos/:id);
- Marcar um *todo* como feito: (PATCH /todos/:id/done);
- Excluir um *todo*: (DELETE /todos/:id);

Tudo isso para cada usuário em específico (o `username` será passado pelo header). [Documentação](https://github.com/igorsteixeira94/desafio-conceitos-node/blob/main/insomnia/desafio1) pode ser importada para o Insomnia!

## Como Usar

```shell
git clone git@github.com:igorsteixeira94/desafio-conceitos-node.git

cd desafio-conceitos-node

yarn install

yarn dev
```


## Testes

![coverage](https://user-images.githubusercontent.com/47749249/113796997-caafc380-9726-11eb-9cb3-00d2a3e5ceac.png)


# Projeto de Assistente Virtual no WhatsApp

Este projeto é um assistente virtual simples utilizando a biblioteca `whatsapp-web.js` para integração com o WhatsApp Web. O assistente é capaz de interagir com usuários, fazendo perguntas e registrando respostas. Além disso, é possível enviar mensagens para um número específico via API.

## Funcionalidades

- Escaneamento de QR Code para autenticação no WhatsApp Web.
- Interação com usuários através de perguntas sequenciais.
- Envio de mensagens via API.

## Pré-requisitos

- Node.js instalado.
- Uma conta no WhatsApp.

## Instalação

1. Clone este repositório:

    ```bash
    git clone https://github.com/felipesansi/Api-whats.git
    cd Api-whats
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

## Uso

1. Inicie o servidor:

    ```bash
    node index.js
    ```

2. Abra o WhatsApp no seu celular e escaneie o QR Code exibido no console para autenticar.

3. O assistente começará a interagir automaticamente com os usuários que enviarem mensagens.

## API
Essa `API` é REST 
### Envio de mensagens

#### Endpoint

```http
POST /send
 ```

### Parâmetros
 `numero:` 5511999999999 <br>
`msg`: Olá, sou um assistênte para mensagem

## Contatos
 [Linkeding ](https://www.linkedin.com/in/felipesansi/)

[ Portifólio](https://felipesansi.github.io/portifolio-dev-felipe/)
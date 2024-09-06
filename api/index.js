const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const cliente = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

const estadosUsuarios = {};

cliente.on('qr', (qr) => {
    console.log('QR code recebido, escaneie-o com seu WhatsApp.');
    qrcode.generate(qr, { small: true });
});

cliente.on('ready', () => {
    console.log('WhatsApp conectado com sucesso!');
});

cliente.on('disconnected', (motivo) => {
    console.log(`Cliente desconectado: ${motivo}`);
    console.log('Tentando reconectar...');
    cliente.initialize();
});

cliente.on('auth_failure', (mensagem) => {
    console.error('Falha na autenticação', mensagem);
});

const obterProximaPergunta = (etapa, nome) => {
    const perguntas = [
        'Qual é o seu nome?',
        nome ? `${nome}, quantos anos você tem?` : 'Quantos anos você tem?',
        nome ? `${nome}, você me conhece?` : 'Você me conhece?',
        nome ? `${nome}, Qual nota você daria para esse atendimento?` : 'qual nota você daria para esse atendimento?'
    ];
    return perguntas[etapa];
};

cliente.on('message', async (mensagem) => {
    const idUsuario = mensagem.from;
    let estadoUsuario = estadosUsuarios[idUsuario] || { etapa: 0, respostas: [], nome: '', confirmacao: false };

    if (!estadoUsuario.confirmacao) {
        await cliente.sendMessage(idUsuario, " Olá, sou o Neo seu assitrnte virtual nesse whatsapp\nEstou em fase de teste, por favor *Responda algumas Perguntas*\n\n *Escolha uma opção:*\n\n*1* - Para iniciar as perguntas\n*2* - Para encerrar");
        estadoUsuario.confirmacao = true;
        estadosUsuarios[idUsuario] = estadoUsuario;
        return;
    }

    const opcao = mensagem.body.trim();
    switch(opcao) {
        case '1':
            const pergunta = obterProximaPergunta(estadoUsuario.etapa, estadoUsuario.nome);
            await cliente.sendMessage(idUsuario, pergunta);
            estadoUsuario.etapa++;
            estadosUsuarios[idUsuario] = estadoUsuario;
            break;

        case '2':
            await cliente.sendMessage(idUsuario, "OK, Precisando novamente mande mensagem....");
            delete estadosUsuarios[idUsuario];
            break;

        default:
            if (estadoUsuario.etapa > 0) {
                estadoUsuario.respostas.push(mensagem.body);
                if (estadoUsuario.etapa === 1) 
                {
                    estadoUsuario.nome = mensagem.body;
                }
                if(estadoUsuario.etapa=== 3)
                {
                   if(mensagem.body.toLocaleLowerCase()==='não'){
                    await cliente.sendMessage(idUsuario, "Sou Neo muito prazer em te conhecer");
                   }

                }


                if (estadoUsuario.etapa < 4) 
                    {
                    const proximaPergunta = obterProximaPergunta(estadoUsuario.etapa, estadoUsuario.nome);
                    await cliente.sendMessage(idUsuario, proximaPergunta);
                    estadoUsuario.etapa++;
                } else {
                    await cliente.sendMessage(idUsuario, "Obrigado por suas respostas!");
                    delete estadosUsuarios[idUsuario];
                }
                estadosUsuarios[idUsuario] = estadoUsuario;
            } else {
                await cliente.sendMessage(idUsuario, "Por favor, escolha uma opção válida.");
            }
            break;
    }

    console.log(`Mensagem recebida de ${mensagem.from}: ${mensagem.body}`);
});

cliente.initialize();


app.post('/send', async (req, res) => {
    const numero = req.query.numero;
    const msg = req.query.msg;

    if (!numero || !msg) {
        return res.status(400).send({ status: 'Parâmetros "numero" e "msg" são obrigatórios.' });
    }

    try {
        const chatId = numero.includes('@c.us') ? numero : `${numero}@c.us`;
        await cliente.sendMessage(chatId, msg);
        res.status(200).send({
            status: 'Mensagem enviada com sucesso!',
            numero: numero.toString()
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
        res.status(500).send({ status: 'Falha ao enviar mensagem', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});



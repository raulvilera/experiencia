# Google Apps Script — recebimento e análise das respostas

O arquivo `Code.gs` recebe as respostas enviadas pela atividade HTML, grava os dados na planilha, corrige automaticamente as cinco questões de múltipla escolha, aplica formatação condicional e constrói o painel de acompanhamento.

## Instalação

Abra a planilha [Planilha de respostas](https://docs.google.com/spreadsheets/d/1VpvIvxX8-ubP89gEPlwfMBXOAo-5op2OpvjXRTP1VqU/edit), acesse **Extensões → Apps Script**, apague o conteúdo inicial e cole o conteúdo de `Code.gs`.

Clique em **Salvar** e execute manualmente a função `setup` uma vez. Na primeira execução, o Google solicitará autorização para acessar a planilha. O script criará as abas `Respostas`, `Avaliação`, `Habilidades` e `Painel`.

## Publicação como aplicativo da Web

No editor do Apps Script, selecione **Implantar → Nova implantação**. Escolha o tipo **Aplicativo da Web**. Em “Executar como”, selecione sua conta. Em “Quem tem acesso”, escolha a opção compatível com a política da escola. Para alunos sem login institucional, a opção pública é necessária, mas deve ser usada somente em uma planilha destinada a receber os dados da atividade.

Copie a URL que termina em `/exec`. Ela será semelhante a:

```text
https://script.google.com/macros/s/ID_DA_IMPLANTACAO/exec
```

Depois, no `script.js` da atividade, substitua:

```javascript
const APPS_SCRIPT_URL = '';
```

por:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/ID_DA_IMPLANTACAO/exec';
```

Publique o `script.js` atualizado no GitHub. O botão **Enviar respostas** enviará os dados por `POST` em JSON.

## Organização da planilha

A aba `Respostas` contém uma linha por envio, com os dados do aluno, as dez respostas, a pontuação das objetivas e campos reservados para correção das dissertativas.

A aba `Avaliação` abre uma linha por questão e por aluno. As questões objetivas recebem automaticamente o status `Correta` ou `Incorreta`. As questões dissertativas recebem inicialmente o status `Pendente`; o professor pode alterar para `Correta`, `Parcial` ou `Incorreta`. A cor azul representa respostas corretas, a vermelha respostas incorretas, a amarela respostas pendentes e a laranja respostas parciais.

A aba `Habilidades` registra a aprendizagem essencial trabalhada em cada questão. A aba `Painel` apresenta o domínio por questão, o acompanhamento por aprendizagem essencial, o número de envios e a média das questões objetivas.

## Alinhamento pedagógico

As descrições em `CONFIG.skills` são um alinhamento didático para esta atividade de meteorologia. Elas não constituem uma matriz oficial da Prova Paulista. Antes de utilizar os resultados como evidência formal, a equipe escolar deve conferir e, se necessário, substituir as descrições pelos códigos e formulações oficiais vigentes no Currículo Paulista, nas orientações da rede e na edição correspondente da Prova Paulista.

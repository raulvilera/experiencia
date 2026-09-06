const students = [
  { call: '1', name: 'ALICE CARDOSO DE ALCANTARA', ra: '115864684', digit: '7', email: '00001158646847SP@al.educacao.sp.gov.br' },
  { call: '3', name: 'ANA LUIZA VALENCA PAIVA', ra: '113191292', digit: '5', email: '00001131912925SP@al.educacao.sp.gov.br' },
  { call: '5', name: 'BRYAN DINIZ SILVA', ra: '115070919', digit: '4', email: '00001150709194SP@al.educacao.sp.gov.br' },
  { call: '6', name: 'CARLOS EDUARDO MENEZES MACHADO', ra: '115074906', digit: '4', email: '00001150749064SP@al.educacao.sp.gov.br' },
  { call: '7', name: 'EVANDRO CUTOLO TEIXEIRA', ra: '116503510', digit: '8', email: '00001165035108SP@al.educacao.sp.gov.br' },
  { call: '9', name: 'GABRIELA SANTOS COSTA', ra: '115612597', digit: '2', email: '00001156125972SP@al.educacao.sp.gov.br' },
  { call: '11', name: 'GUILHERME CARMO RODRIGUES', ra: '114143838', digit: '0', email: '00001141438380SP@al.educacao.sp.gov.br' },
  { call: '12', name: 'GUSTAVO HENRIQUE DA SILVA', ra: '115073645', digit: '8', email: '00001150736458SP@al.educacao.sp.gov.br' },
  { call: '13', name: 'ISAAC FERNANDES DE ANDRADE', ra: '115077031', digit: '4', email: '00001150770314SP@al.educacao.sp.gov.br' },
  { call: '15', name: 'KELVIN DUARTE GONCALVES', ra: '123922922', digit: '7', email: '00001239229227SP@al.educacao.sp.gov.br' },
  { call: '16', name: 'LAURA VITÓRIA ROCHA', ra: '115885097', digit: '9', email: '00001158850979SP@al.educacao.sp.gov.br' },
  { call: '18', name: 'LETICIA CUSTÓDIO LIMA', ra: '113478815', digit: '0', email: '00001134788150SP@al.educacao.sp.gov.br' },
  { call: '19', name: 'LUCAS EDUARDO DA SILVA SANTANA', ra: '116528728', digit: '6', email: '00001165287286SP@al.educacao.sp.gov.br' },
  { call: '20', name: 'MATHEUS KAUÃ DOS SANTOS NASCIMENTO', ra: '116517361', digit: 'X', email: '0000116517361XSP@al.educacao.sp.gov.br' },
  { call: '21', name: 'MAYARA CAETANO DE OLIVEIRA PINA', ra: '114156129', digit: '3', email: '00001141561293sp@al.educacao.sp.gov.br' },
  { call: '22', name: 'MIGUEL LIMA DE MESQUITA', ra: '113987186', digit: '9', email: '00001139871869sp@al.educacao.sp.gov.br' },
  { call: '24', name: 'NICOLAS ROCHA SILVA', ra: '114156895', digit: '0', email: '00001141568950SP@al.educacao.sp.gov.br' },
  { call: '25', name: 'PAOLLA MICHELLINE DOS SANTOS MARQUES', ra: '114439186', digit: '6', email: '00001144391866SP@al.educacao.sp.gov.br' },
  { call: '27', name: 'PEDRO HENRIQUE CORREA DE BRITO', ra: '114788668', digit: '4', email: '00001147886684SP@al.educacao.sp.gov.br' },
  { call: '28', name: 'PEDRO LEONARDO DE ANDRADE MARQUES', ra: '114423093', digit: '7', email: '00001144230937SP@al.educacao.sp.gov.br' },
  { call: '29', name: 'RAFAEL HENRIQUE SIQUEIRA BERNARDES ZIA', ra: '115889516', digit: '1', email: '00001158895161SP@al.educacao.sp.gov.br' },
  { call: '30', name: 'RAPHAEL MATHIAS NUNES MIRANDA', ra: '115889692', digit: 'X', email: '0000115889692XSP@al.educacao.sp.gov.br' },
  { call: '34', name: 'SAMUEL ALVES DA COSTA', ra: '120763264', digit: '8', email: '00001207632648SP@al.educacao.sp.gov.br' },
  { call: '35', name: 'SOFIA AZEREDO CUBAS', ra: '121480006', digit: '3', email: '00001214800063SP@al.educacao.sp.gov.br' },
  { call: '36', name: 'SOPHIA LACERDA ANDRADE', ra: '115070916', digit: '9', email: '00001150709169SP@al.educacao.sp.gov.br' },
  { call: '37', name: 'THAYLLA DUANNY VENANCIO SCAQUITO', ra: '116521711', digit: '9', email: '00001165217119SP@al.educacao.sp.gov.br' },
  { call: '38', name: 'THAYS RODRIGUES DA SILVA', ra: '115073651', digit: '3', email: '00001150736513SP@al.educacao.sp.gov.br' },
  { call: '40', name: 'MANOELLA DOS ANJOS SANTOS', ra: '115051147', digit: '3', email: '00001150511473sp@al.educacao.sp.gov.br' },
  { call: '41', name: 'MARIANA CHARRUA GAIA MION SILVA', ra: '115613059', digit: '1', email: '00001156130591sp@al.educacao.sp.gov.br' },
  { call: '42', name: 'DIOGO DA SILVA VELOSO', ra: '115079900', digit: '6', email: '00001150799006SP@al.educacao.sp.gov.br' },
  { call: '43', name: 'QUÉZIA DO ESPIRITO SANTO ROBERTI', ra: '113498275', digit: '6', email: '00001134982756sp@al.educacao.sp.gov.br' },
  { call: '44', name: 'KEMILLYN ANDRADE DE SOUZA SILVA', ra: '115883793', digit: '8', email: '00001158837938sp@al.educacao.sp.gov.br' }
];

const form = document.getElementById('activityForm');
const studentName = document.getElementById('studentName');
const statusMessage = document.getElementById('statusMessage');
const storageKey = 'atividade-meteorologia-8ano-respostas';
// Cole aqui a URL publicada como "Aplicativo da Web" no Google Apps Script.
const APPS_SCRIPT_URL = '';
const metadataFields = ['callNumber', 'institutionalEmail', 'raNumber', 'raDigit', 'activityDate'];

function todayAsInputDate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

document.getElementById('activityDate').value = todayAsInputDate();

students.forEach((student) => {
  const option = document.createElement('option');
  option.value = student.name;
  option.textContent = student.name;
  studentName.appendChild(option);
});

function fillStudentData() {
  const student = students.find((item) => item.name === studentName.value);
  const values = student || { call: '', email: '', ra: '', digit: '' };
  document.getElementById('callNumber').value = values.call;
  document.getElementById('institutionalEmail').value = values.email;
  document.getElementById('raNumber').value = values.ra;
  document.getElementById('raDigit').value = values.digit;
}

function showStatus(message, error = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = error ? '#a52c2c' : '#28613d';
}

function collectAnswers() {
  const data = {
    submissionId: `meteorologia-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    activity: 'Equipamentos meteorológicos — Ciências 8º ano',
    studentName: studentName.value
  };
  metadataFields.forEach((id) => { data[id] = document.getElementById(id).value; });
  for (let number = 1; number <= 5; number += 1) {
    const selected = document.querySelector(`input[name="q${number}"]:checked`);
    data[`q${number}`] = selected ? selected.value : '';
  }
  for (let number = 6; number <= 10; number += 1) {
    data[`q${number}`] = document.getElementById(`q${number}`).value;
  }
  return data;
}

async function sendAnswers() {
  if (!studentName.value) {
    document.getElementById('studentError').textContent = 'Selecione seu nome antes de enviar.';
    studentName.focus();
    showStatus('Selecione seu nome antes de enviar.', true);
    return;
  }
  if (!form.checkValidity()) {
    form.reportValidity();
    showStatus('Complete todas as questões antes de enviar.', true);
    return;
  }
  if (!APPS_SCRIPT_URL) {
    showStatus('O envio ainda não está conectado. Configure a URL do Apps Script no arquivo script.js.', true);
    return;
  }

  const submitButton = document.getElementById('submitButton');
  const payload = collectAnswers();
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    localStorage.removeItem(storageKey);
    showStatus('Respostas enviadas com sucesso. Obrigado!');
  } catch (error) {
    showStatus('Não foi possível enviar agora. Salve as respostas e tente novamente.', true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Enviar respostas';
  }
}

function restoreAnswers() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data.studentName) {
      studentName.value = data.studentName;
      fillStudentData();
    }
    metadataFields.forEach((id) => {
      if (data[id] && id !== 'callNumber' && id !== 'institutionalEmail' && id !== 'raNumber' && id !== 'raDigit') {
        document.getElementById(id).value = data[id];
      }
    });
    for (let number = 1; number <= 5; number += 1) {
      if (data[`q${number}`]) {
        const option = document.querySelector(`input[name="q${number}"][value="${data[`q${number}`]}"]`);
        if (option) option.checked = true;
      }
    }
    for (let number = 6; number <= 10; number += 1) {
      const answer = document.getElementById(`q${number}`);
      if (answer && data[`q${number}`]) answer.value = data[`q${number}`];
    }
    showStatus('Respostas salvas anteriormente foram restauradas.');
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
}

studentName.addEventListener('change', () => {
  fillStudentData();
  document.getElementById('studentError').textContent = '';
});

document.getElementById('submitButton').addEventListener('click', sendAnswers);

document.getElementById('saveButton').addEventListener('click', () => {
  if (!studentName.value) {
    document.getElementById('studentError').textContent = 'Selecione seu nome antes de salvar.';
    studentName.focus();
    showStatus('Selecione seu nome antes de salvar.', true);
    return;
  }
  document.getElementById('studentError').textContent = '';
  localStorage.setItem(storageKey, JSON.stringify(collectAnswers()));
  showStatus('Respostas e dados do estudante salvos neste dispositivo.');
});

document.getElementById('printButton').addEventListener('click', () => window.print());

  document.getElementById('clearButton').addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  document.getElementById('studentError').textContent = '';
  metadataFields.forEach((id) => { document.getElementById(id).value = id === 'activityDate' ? todayAsInputDate() : ''; });
  showStatus('');
});

form.addEventListener('submit', (event) => event.preventDefault());
restoreAnswers();

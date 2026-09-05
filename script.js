const students = [
  'ALICE CARDOSO DE ALCANTARA', 'ANA LUIZA VALENCA PAIVA', 'BRYAN DINIZ SILVA',
  'CARLOS EDUARDO MENEZES MACHADO', 'EVANDRO CUTOLO TEIXEIRA', 'GABRIELA SANTOS COSTA',
  'GUILHERME CARMO RODRIGUES', 'GUSTAVO HENRIQUE DA SILVA', 'ISAAC FERNANDES DE ANDRADE',
  'KELVIN DUARTE GONCALVES', 'LAURA VITÓRIA ROCHA', 'LETICIA CUSTÓDIO LIMA',
  'LUCAS EDUARDO DA SILVA SANTANA', 'MATHEUS KAUÃ DOS SANTOS NASCIMENTO',
  'MAYARA CAETANO DE OLIVEIRA PINA', 'MIGUEL LIMA DE MESQUITA', 'NICOLAS ROCHA SILVA',
  'PAOLLA MICHELLINE DOS SANTOS MARQUES', 'PEDRO HENRIQUE CORREA DE BRITO',
  'PEDRO LEONARDO DE ANDRADE MARQUES', 'RAFAEL HENRIQUE SIQUEIRA BERNARDES',
  'RAPHAEL MATHIAS NUNES MIRANDA', 'SAMUEL ALVES DA COSTA', 'SOFIA AZEREDO CUBAS',
  'SOPHIA LACERDA ANDRADE', 'THAYLLA DUANNY VENANCIO SCAQUITO', 'THAYS RODRIGUES DA SILVA',
  'MANOELLA DOS ANJOS SANTOS', 'MARIANA CHARRUA GAIA MION SILVA', 'DIOGO DA SILVA VELOSO',
  'QUÉZIA DO ESPIRITO SANTO ROBERTI', 'KEMILLYN ANDRADE DE SOUZA SILVA'
];

const form = document.getElementById('activityForm');
const studentName = document.getElementById('studentName');
const statusMessage = document.getElementById('statusMessage');
const storageKey = 'atividade-meteorologia-8ano-respostas';

students.forEach((name) => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  studentName.appendChild(option);
});

function showStatus(message, error = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = error ? '#a52c2c' : '#28613d';
}

function collectAnswers() {
  const data = { studentName: studentName.value };
  for (let number = 1; number <= 5; number += 1) {
    const selected = document.querySelector(`input[name="q${number}"]:checked`);
    data[`q${number}`] = selected ? selected.value : '';
  }
  for (let number = 6; number <= 10; number += 1) {
    data[`q${number}`] = document.getElementById(`q${number}`).value;
  }
  return data;
}

function restoreAnswers() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data.studentName) studentName.value = data.studentName;
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

document.getElementById('saveButton').addEventListener('click', () => {
  if (!studentName.value) {
    document.getElementById('studentError').textContent = 'Selecione seu nome antes de salvar.';
    studentName.focus();
    showStatus('Selecione seu nome antes de salvar.', true);
    return;
  }
  document.getElementById('studentError').textContent = '';
  localStorage.setItem(storageKey, JSON.stringify(collectAnswers()));
  showStatus('Respostas salvas neste dispositivo.');
});

document.getElementById('printButton').addEventListener('click', () => {
  window.print();
});

document.getElementById('clearButton').addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  document.getElementById('studentError').textContent = '';
  showStatus('');
});

form.addEventListener('submit', (event) => event.preventDefault());
restoreAnswers();

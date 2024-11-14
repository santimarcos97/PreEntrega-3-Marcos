document.addEventListener('DOMContentLoaded', () => {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let username = "";

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
        })
        .catch(error => {
            console.error('Error al cargar las preguntas:', error);
        });

    function normalizeString(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function checkAnswer(userAnswer, correctAnswer) {
        const normalizedUserAnswer = normalizeString(userAnswer);
        const normalizedCorrectAnswer = normalizeString(correctAnswer);
        return normalizedUserAnswer === normalizedCorrectAnswer;
    }

    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const questionContainer = document.getElementById('question-container');
            questionContainer.textContent = questions[currentQuestionIndex].question;
            document.getElementById('answer-input').value = '';
            document.getElementById('feedback').textContent = '';
        } else {
            endQuiz();
        }
    }

    document.getElementById('submit-answer').addEventListener('click', () => {
        const userAnswer = document.getElementById('answer-input').value.trim();
        const correctAnswer = questions[currentQuestionIndex].answer;

        if (checkAnswer(userAnswer, correctAnswer)) {
            score += 10;
            document.getElementById('feedback').textContent = '¡Correcto!';
        } else {
            document.getElementById('feedback').textContent = `Incorrecto. La respuesta correcta es: ${correctAnswer}`;
        }

        currentQuestionIndex++;
        setTimeout(showQuestion, 2000);
    });

    document.getElementById('start-button').addEventListener('click', () => {
        username = document.getElementById('username-input').value.trim();
        if (username === "") {
            alert("Por favor, ingresa tu nombre");
            return;
        }
        document.getElementById('intro-card').style.display = 'none';
        document.getElementById('score-card').style.display = 'block';
    });

    document.getElementById('begin-quiz').addEventListener('click', () => {
        document.getElementById('score-card').style.display = 'none';
        document.getElementById('quiz-card').style.display = 'block';
        showQuestion();
    });

    function endQuiz() {
        document.getElementById('quiz-card').style.display = 'none';
        document.getElementById('final-score-card').style.display = 'block';
        document.getElementById('score').textContent = score;
        saveScore(username, score);
        displayScores();
    }

    function saveScore(name, score) {
        let scores = JSON.parse(localStorage.getItem('quizScores')) || [];
        scores.push({ name: name, score: score });
        localStorage.setItem('quizScores', JSON.stringify(scores));
    }

    function displayScores() {
        let scores = JSON.parse(localStorage.getItem('quizScores')) || [];
        const scoreList = document.getElementById('final-score-list');
        scoreList.innerHTML = '';
        scores.forEach(scoreEntry => {
            let li = document.createElement('li');
            li.textContent = `${scoreEntry.name}: ${scoreEntry.score} puntos`;
            scoreList.appendChild(li);
        });
    }

    function loadScore() {
        const savedScore = localStorage.getItem('quizScore');
        if (savedScore) {
            score = parseInt(savedScore);
        }
    }

    function clearScores() {
        localStorage.removeItem('quizScores');
        alert("Se han eliminado todos los puntajes guardados.");
    }
    document.getElementById('clear-scores-button').addEventListener('click', clearScores);
    
    loadScore();
});

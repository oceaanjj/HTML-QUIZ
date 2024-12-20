let currentQuestion = 0;
let userScore = 0;
let quizTimer;
let timeLeft = 3600; 

document.getElementById('startQuiz').addEventListener('click', function() {
    resetQuiz();
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    showQuestion();
    startTimer();
});

function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    document.getElementById('label0').textContent = question.answers[0];
    document.getElementById('label1').textContent = question.answers[1];
    document.getElementById('label2').textContent = question.answers[2];
    document.getElementById('label3').textContent = question.answers[3];
    document.querySelectorAll('input[name="answer"]').forEach(input => input.checked = false);
}

document.getElementById('submitAnswer').addEventListener('click', function() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        const answerIndex = parseInt(selectedAnswer.value);
        if (questions[currentQuestion].correctAnswer === answerIndex) {
            userScore++;
        }
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    } else {
        alert('Please select an answer before submitting.');
    }
});

function finishQuiz() {
    stopTimer();
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('inputScore').style.display = 'block';
    document.getElementById('finalScore').textContent = userScore;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    quizTimer = setInterval(function() {
        timeLeft--;
        const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        timerElement.textContent = `${hours} : ${minutes} : ${seconds}`;
        if (timeLeft <= 0) {
            finishQuiz();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(quizTimer);
}

document.getElementById('submitInitials').addEventListener('click', function() {
    const initials = document.getElementById('initials').value;
    if (initials) {
        const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
        highscores.push({ initials, score: userScore });
        highscores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highscores', JSON.stringify(highscores));
        showHighscores();
    } else {
        alert('Please enter your initials.');
    }
});

document.getElementById('viewScores').addEventListener('click', function() {
    document.getElementById('welcome').style.display = 'none';
    showHighscores();
});

function showHighscores() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('inputScore').style.display = 'none';
    document.getElementById('highscores').style.display = 'block';

    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    const scoresElement = document.getElementById('scores');
    scoresElement.innerHTML = highscores.map(score => `<div>${score.initials}: ${score.score}</div>`).join('');
}

document.getElementById('viewScores').addEventListener('click', showHighscores);

document.getElementById('goBack').addEventListener('click', function() {
    document.getElementById('highscores').style.display = 'none';
    document.getElementById('welcome').style.display = 'block';
});

document.getElementById('clearScores').addEventListener('click', function() {
    localStorage.removeItem('highscores');
    showHighscores();
});

document.getElementById('viewAnswers').addEventListener('click', function() {
    document.getElementById('highscores').style.display = 'none';
    document.getElementById('answers').style.display = 'block';

    const answerList = document.getElementById('answerList');
    answerList.innerHTML = questions.map((q, index) =>
        `<div>${index + 1}. ${q.question}<br>Correct Answer: ${q.answers[q.correctAnswer]}</div>`).join('<br>');
});

document.getElementById('backToScores').addEventListener('click', function() {
    document.getElementById('answers').style.display = 'none';
    document.getElementById('highscores').style.display = 'block';
});

function resetQuiz() {
    currentQuestion = 0;
    userScore = 0;
    timeLeft = 3600;
    document.getElementById('timer').textContent = '01 : 00 : 00';
}


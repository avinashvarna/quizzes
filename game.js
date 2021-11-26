const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

let res = [
  {
    "vaakya": "गदापाणिः भीमः कौरवैः सह युद्धं कृतवान्",
    "samaasas": [
      {
        "word": "गदापाणिः",
        "samaasa": "बहुव्रीहिः",
        "subtype": "व्यधिकरणः बहुव्रीहिः",
        "vigraha": "गदा पाणौ यस्य सः"
      }
    ]
  },
  {
    "vaakya": "गणेशः सुमुखः एकदन्तः इति च प्रख्यातः",
    "samaasas": [
      {
        "word": "गणेशः",
        "samaasa": "तत्पुरुषः",
        "subtype": "षष्ठी-तत्पुरुषः",
        "vigraha": "गणानाम् ईशः"
      },
      {
        "word": "सुमुखः",
        "samaasa": "बहुव्रीहिः",
        "subtype": "प्रादिः बहुव्रीहिः",
        "vigraha": "शोभनं मुखं यस्य सः"
      },
      {
        "word": "एकदन्तः",
        "samaasa": "बहुव्रीहिः",
        "subtype": "समानाधिकरणः बहुव्रीहिः",
        "vigraha": "एकः दन्तःस् यस्य सः"
      }
    ]
  }
];

let samaasas = ['तत्पुरुषः', 'बहुव्रीहिः', 'द्वन्द्वः', 'अव्ययीभावः'];
let samaasaChoices = {};
for (const [index, element] of samaasas.entries()) {
	samaasaChoices["choice" + (index + 1)] = element;
}
// console.log(samaasaChoices);

function formatQuestions(data) {
	let questions = [];
	data.forEach((d) => {
		d.samaasas.forEach((s) => {
			let q = '"' + d.vaakya + ' ।" <br>' + "अस्मिन् वाक्ये <strong>";
			q += s.word + "</strong> इति पदे कः समासः ?";

			let answer = samaasas.indexOf(s.samaasa) + 1;
			questions.push({"question" : q, "answer": answer, ...samaasaChoices});
		});
	});
	return questions;
}

//CONSTANTS
const CORRECT_BONUS = 1;
let MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
	MAX_QUESTIONS = Math.min(MAX_QUESTIONS, availableQuesions.length);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');

};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        } else {
			choices[currentQuestion.answer-1].parentElement.classList.add('correct');
		}

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
			if (classToApply !== 'correct') {
				choices[currentQuestion.answer-1].parentElement.classList.remove('correct');
			}
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

questions = formatQuestions(res);
// console.log(questions);
startGame();

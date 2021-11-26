const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const quiz = document.getElementById('quiz');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

let MAX_QUESTIONS = 10;
let quiz_type= 'मुख्य-समासाः';
const params = new URLSearchParams(window.location.search);
//console.log(params);
if(params.has('questions')) {
	MAX_QUESTIONS = params.get('questions');
}
if(params.has('quiz_type')) {
	quiz_type = params.get('quiz_type');
}

let samaasas = ['तत्पुरुषः', 'बहुव्रीहिः', 'द्वन्द्वः', 'अव्ययीभावः'];
let samaasaChoices = {};
for (const [index, element] of samaasas.entries()) {
	samaasaChoices["choice" + (index + 1)] = element;
}
// console.log(samaasaChoices);

function formatQuestions(data) {
	let questions = [];
	data.forEach((d) => {
		if(quiz_type === 'मुख्य-समासाः') {
			d.samaasas.forEach((s) => {
				let q = '"' + d.vaakya + ' ।" <br>' + "अस्मिन् वाक्ये <strong>";
				q += s.word + "</strong> इति पदे कः समासः ?";

				let answer = samaasas.indexOf(s.samaasa) + 1;
				questions.push({"question" : q, "answer": answer, ...samaasaChoices});
			});
		}
	});
	return questions;
}

//CONSTANTS
const CORRECT_BONUS = 1;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
	MAX_QUESTIONS = Math.min(MAX_QUESTIONS, availableQuesions.length);
    getNewQuestion();
    quiz.classList.remove('hidden');
    loader.classList.add('hidden');
};

endQuiz = () => {
	localStorage.setItem('mostRecentScore', `${score} / ${questionCounter}`);
        //go to the end page
        return window.location.assign('end.html');
}

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        endQuiz();
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
		choice.parentElement.classList.remove('correct');
		choice.parentElement.classList.remove('incorrect');
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
	nextQuestionBtn.disabled = true;
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
		nextQuestionBtn.disabled = false;
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

/*
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
const myPromise = new Promise((resolve, reject) => {
	resolve(res);
})
*/
fetch('samaasas.json')
	.then((res) => res.json())
	.then((res) => {
		questions = formatQuestions(res);
		// console.log(questions);
		startGame();
	})
	.catch((err) => {
        console.error(err);
    });

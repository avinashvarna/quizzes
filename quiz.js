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

// Parse query params to find quiz type and number of questions
const params = new URLSearchParams(window.location.search);
if(params.has('questions')) {
	MAX_QUESTIONS = params.get('questions');
}
if(params.has('quiz_type')) {
	quiz_type = params.get('quiz_type');
}

let samaasas = ['तत्पुरुषः', 'बहुव्रीहिः', 'द्वन्द्वः', 'अव्ययीभावः'];
let samaasaChoices = {};
for (const [index, element] of samaasas.entries()) {
	samaasaChoices["choice" + index] = element;
}
// console.log(samaasaChoices);

let tatpuruShaH = [
    'प्रथमा-तत्पुरुषः',
    'द्वितीया-तत्पुरुषः',
    'तृतीया-तत्पुरुषः',
    'चतुर्थी-तत्पुरुषः',
    'पञ्चमी-तत्पुरुषः',
    'षष्ठी-तत्पुरुषः',
    'सप्तमी-तत्पुरुषः',
    'विशेषण-पूर्वपदः कर्मधारयः',
    'उपमान-पूर्वपदः कर्मधारयः',
    'उपमान-उत्तरपदः कर्मधारयः',
    'अवधारणा-पूर्वपदः कर्मधारयः',
    'संभावना-पूर्वपदः कर्मधारयः',
    'मध्यमपदलोपः कर्मधारयः',
    'द्विगुः',
    'नञ्-तत्पुरुषः'
];

let bahuvrIhiH = [
    'समानाधिकरणः बहुव्रीहिः',
    'व्यधिकरणः बहुव्रीहिः',
    'नञ्-बहुव्रीहिः',
    'सहपूर्वपदः बहुव्रीहिः',
    'प्रादिः बहुव्रीहिः',
    'उपमान-पूर्वपदः बहुव्रीहिः'
];

let dvandvaH = [
    'इतरेतर-द्वन्द्वः',
    'समाहार-द्वन्द्वः'
];

//avyayIbhAva = []


function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}


function formatQuestions(data) {
	let questions = [];
	data.forEach((d) => {
		if(quiz_type === 'मुख्य-समासाः') {
			d.samaasas.forEach((s) => {
				let q = '"' + d.vaakya + ' ।" <br>' + "अस्मिन् वाक्ये <strong>";
				q += s.word + "</strong> इति पदे कः समासः ?";

				let answer = samaasas.indexOf(s.samaasa);
				questions.push({"question" : q, "answer": answer,
								"num_choices": 4,
								...samaasaChoices});
			});
		} else if(quiz_type === "समास-प्रभेदाः") {
			d.samaasas.forEach((s) => {
				let prabhedaaH = null;

				if(s.samaasa === 'तत्पुरुषः') {
					prabhedaaH = tatpuruShaH;
				} else if (s.samaasa === 'बहुव्रीहिः') {
					prabhedaaH = bahuvrIhiH;
				} else if (s.samaasa === 'द्वन्द्वः') {
					prabhedaaH = dvandvaH;
				}

				if(prabhedaaH) {
					let q = '"' + d.vaakya + ' ।" <br>' + "अस्मिन् वाक्ये <strong>";
					q += s.word + "</strong> इति पदे कः समासः ?";
					let question = {"question" : q};

					let num_choices = Math.min(prabhedaaH.length, 4);
					shuffle(prabhedaaH);
					options = prabhedaaH.slice(0, num_choices-1);
					if(options.includes(s.subtype)) {
						options.push(prabhedaaH[num_choices-1]);
					} else {
						options.push(s.subtype);
					}
					shuffle(options);
					for (const [index, element] of options.entries()) {
						question["choice" + index] = element;
					}
					question["answer"] = options.indexOf(s.subtype);
					question["num_choices"] = num_choices;
					questions.push(question);
					//console.log(question);
				}
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
		return;
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
		if(number < currentQuestion["num_choices"]) {
			choice.innerHTML = currentQuestion['choice' + number];
			choice.parentElement.style.display = "flex";
		} else {
			choice.innerHTML = "";
			choice.parentElement.style.display = "none";
		}
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
			choices[currentQuestion.answer].parentElement.classList.add('correct');
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
        "vigraha": "एकः दन्तः यस्य सः"
      }
    ]
  },
  {
    "vaakya": "कुन्तीपुत्रौ शस्त्रपाणी भीमार्जुनौ शतसंख्याकान् कौरवान् हतवन्तौ",
    "samaasas": [
      {
        "word": "कुन्तीपुत्रौ",
        "samaasa": "तत्पुरुषः",
        "subtype": "षष्ठी-तत्पुरुषः",
        "vigraha": "कुन्त्याः पुत्रः । तौ ।"
      },
      {
        "word": "शस्त्रपाणी",
        "samaasa": "बहुव्रीहिः",
        "subtype": "व्यधिकरणः बहुव्रीहिः",
        "vigraha": "शस्त्रं पाणौ यस्य सः । तौ ।"
      },
      {
        "word": "भीमार्जुनौ",
        "samaasa": "द्वन्द्वः",
        "subtype": "इतरेतर-द्वन्द्वः",
        "vigraha": "भीमश्च अर्जुनश्च"
      },
      {
        "word": "शतसंख्याकान्",
        "samaasa": "बहुव्रीहिः",
        "subtype": "समानाधिकरणः बहुव्रीहिः",
        "vigraha": "शतं संख्या येषां ते"
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
		console.log("No. of questions = " + questions.length);
		startGame();
	})
	.catch((err) => {
        console.error(err);
    });

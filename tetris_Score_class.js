class Score {
    score = 0;
    scoreAll = 0;
    level = 0;
    text = "";
    updateLevel = 100;

    constructor(speed, speedMax) {
        this.speed = speed;
        this.speedMax = speedMax;
    }

    updateScore(speed) {
        this.scoreAll = localStorage.getItem('max_score_letris');
        document.querySelector('.scoreAll').textContent = this.scoreAll;
        document.querySelector('.score').textContent = this.score;
        document.querySelector('.level').textContent = this.level;
        document.querySelector('.speed').textContent = this.text + speed / 1000 + ' second';
    }

    updateGlobalData(speed) {
        this.score = 0;
        this.level = 0;
        this.speed = speed;
        this.text = "";
    }

    addScore(speed) {
        this.score += 10;
        if (this.score > this.scoreAll || this.scoreAll == undefined) {
            this.scoreAll = this.score;
            localStorage.setItem('max_score_letris', this.scoreAll);
        }
        this.level = Math.floor(this.score / this.updateLevel);
        speed = Math.max(this.speedMax, 1000 - this.level * 100);
        if (speed <= this.speedMax) { this.text = 'max '; }
        this.updateScore(speed);
        return speed;
    }
}
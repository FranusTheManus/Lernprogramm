"use strict";
// s86074 Franz Regir
//import {katex} from "./scripts/katex/katex";


let winCount = 0, failCount = 0, questionCount = 0, currentSubject = 0, trueAnswer = 0, pres;
var data, randomTask, ans;
/*
data.allgemein = undefined;
data.mathe = undefined;
data.internettechnologien = undefined;
 */

document.addEventListener('DOMContentLoaded', function () {
    let m = new Model();
    let p = pres = new Presenter();
    let v = new View(p);
    p.setModelAndView(m, v);
    //m.fetchData();
    p.setTask();
});

// ############# Model ###########################################################################
class Model {
    taskNr = 0;
    //currentData;
    constructor() { }

/*
    // Holt eine Frage aus dem Array, zufällig ausgewählt oder vom Server
    getTask(nr) {
//        if (nr === -1)
//            nr = Math.floor(Math.random() * 4);
        let subject= "";
        if (currentSubject === 0) {
            subject = "allgemein";
            //this.currentData = this.data["allgemein"];
            //return this.currentdata[nr%this.currentdata.length];
        } else if (currentSubject === 1) {
            subject = "mathe";
            //this.currentData = this.data["mathe"];
            //return this.currentdata[nr%this.currentdata.length];
        } else if (currentSubject === 2) {
            subject = "internettechnologien";
            //this.currentData = this.data["internettechnologien"];
            //return this.currentdata[nr%this.currentdata.length];
        } else if (currentSubject === 3) {}
        console.log(this.data[subject][nr%this.data[subject].length]);
        return this.data[subject][nr%this.data[subject].length].a;
        //console.log("current data: ", this.currentData);

        //if (this.currentData !== null && this.currentData !== undefined && this.currentData) {
        //    console.log("current question: ", this.currentData[nr % this.currentData.length]);
        //    this.taskNr++;
        //    return this.currentData[nr % this.currentData.length];
        //}
//        return "Frage nicht gefunden :(";
//        return "21 + 21";  // Aufgabe + Lösungen
    }
 */
    /*
    checkAnswer(answer) {
        // TODO
        let sub = document.getElementById("subject"+(answer+1)).getAttribute("value");
        if (this.data[sub][this.taskNr].l[0] === document.getElementById("answer").innerHTML) //Number(document.getElementById("answer").getAttribute("number"))
            {}

    }
     */



    fetchData() {
        if (currentSubject < 3) {
            const filePath = "./data.json";
            console.log("loading data from file: ", filePath);
            let req = new XMLHttpRequest();
            req.open('GET', filePath, true);
            req.onload = function () {
                data = JSON.parse(req.responseText);
                console.log("Quizdaten: ", data);
                Presenter.whichSubject(data);
            };
            req.send();
        } else {
            console.log("loading data through REST API")
        }
    }
}

// ############ Controller ########################################################################
class Presenter {
    constructor() {
        this.anr = 0;
    }

    setModelAndView(m, v) {
        this.m = m;
        this.v = v;
    }

     // Holt eine neue Frage aus dem Model und setzt die View
    setTask() {
        if (currentSubject === 3) {
            console.log("downloading data from online repository through REST");
        } else {
            console.log("downloading data from data file on my public HTW-directory");

            /*
            let frag = this.m.getTask(this.anr);
            console.log("Frage ausgewählt", frag);
            //console.log("Frage ausgewählt", frag.a);
            //frag.l.forEach(ans => {console.log(ans)})
            this.shuffle(frag);
            console.log(frag);
            View.renderText(frag.a);
            for (let i = 0; i < 4; i++) {
                let wert = frag.l[i];
                let pos = i;
                View.inscribeButtons(i, wert, pos); // Tasten beschriften -> View -> Antworten
            }
             */
        }
        this.m.fetchData();
        //console.log("fetched data: ", data);
    }

    static whichSubject() {
        if (currentSubject === 0) {
            console.log("topic: general");
            View.renderText(data.allgemein);
        } else if (currentSubject === 1) {
            console.log("topic: math");
            View.renderText(data.mathe);
        } else if (currentSubject === 2) {
            console.log("topic: IT");
            View.renderText(data.internettechnologien);
        } else if (currentSubject === 3) {
            console.log("topic: from online repository");
        }
    }
    static shuffle(ans) {
        trueAnswer = 0;
        console.log(ans);
        for(let i = 0, j, b; i < ans.length; i++) {
            j = Math.floor(Math.random() * 4);
            if (i !== j) {
                b = ans[i];
                ans[i] = ans[j];
                ans[j] = b;
                if (trueAnswer === i)
                    trueAnswer = j;
                else if (trueAnswer === j)
                    trueAnswer = i;
            }
        }
        console.log(ans, " -> Antworten gemischt. Die richtige Antwort ist ", trueAnswer);
    }

    // Prüft die Antwort, aktualisiert Statistik und setzt die View
    checkAnswer(answer) {
        if (winCount < 10 && failCount < 10) {
            console.log("Antwort: ", answer);
//        this.m.checkAnswer(answer);
            if (trueAnswer === answer) {
                winCount++;
                this.v.updateScore();
                this.checkScore();
                if (winCount < 10 && failCount < 10)
                    this.setTask();
            } else {
                failCount++;
                this.v.updateScore();
                this.checkScore();
            }
        }
    }
    checkScore() {
        if (winCount > 9) {
            document.getElementById("res").innerText = "Game Over, Gratulation! " + winCount + " richtige Antworten sind 10 Gründe zur Freude!\n" +
                "gestellte Fragen: " + questionCount + "\n" +
                "falsche Antworten: " + failCount + "\n" +
                "Zum neu starten bitte Themenbereich auswählen!";
        } else if (failCount > 9) {
            document.getElementById("res").innerText = "Game Over, " + failCount + " falsche Antworten sind mindestens eine zu viel!\n" + //<br> +
                "gestellte Fragen: " + questionCount + "\n" + //<br> +
                "falsche Antworten: " + winCount + "\n" + //<br> +
                "Zum neu starten bitte Themenbereich auswählen!";
        }
    }
}

// ##################### View #####################################################################
class View {
    constructor(p) {
        this.p = p;  // Presenter
        this.setHandler();
    }

    setHandler() {
        // use capture false -> bubbling (von unten nach oben aufsteigend)
        // this soll auf Objekt zeigen -> bind (this)
        document.getElementById("answer").addEventListener("click", this.checkEvent.bind(this), false);
        document.getElementById("start").addEventListener("click", this.start.bind(this), false);
        document.getElementById("subject1").addEventListener("click", this.checkEvent.bind(this), false);
        document.getElementById("subject2").addEventListener("click", this.checkEvent.bind(this), false);
        document.getElementById("subject3").addEventListener("click", this.checkEvent.bind(this), false);
        document.getElementById("subject4").addEventListener("click", this.checkEvent.bind(this), false);
    }

    start() {
        this.p.setTask();
    }

    static inscribeButtons(i, text, pos) {
        document.querySelectorAll("#answer > *")[i].textContent = text;
        //document.querySelectorAll("#answer > *")[i].setAttribute("number", pos);
    }

    checkEvent(event) {
        console.log(event.type, " on ", event.target.id, event.target.type, event.target.getAttribute("name"), event.target.getAttribute("value"), event.target.getAttribute("number"));
        //let et = event.target;
        if (event.target.type === "button" || event.target.type === "submit") {
            console.log("button input ", event.target.attributes.getNamedItem("number").value)
            this.p.checkAnswer(Number(event.target.attributes.getNamedItem("number").value));
        } else if ( event.target.type === "radio" ) {
            console.log("radio input ", event.target.attributes.getNamedItem("number").value);
            document.getElementById("res").innerHTML = "";
            this.resetScore();
            if (event.target.id === "subject1") {
                document.getElementById("subject2").checked = false;
                document.getElementById("subject3").checked = false;
                document.getElementById("subject4").checked = false;
                currentSubject = 0;
            } else if (event.target.id === "subject2" && event.target.checked) {
                document.getElementById("subject1").checked = false;
                document.getElementById("subject3").checked = false;
                document.getElementById("subject4").checked = false;
                currentSubject = 1;
            } else if (event.target.id === "subject3" && event.target.checked) {
                document.getElementById("subject1").checked = false;
                document.getElementById("subject2").checked = false;
                document.getElementById("subject4").checked = false;
                currentSubject = 2;
            } else if (event.target.id === "subject4" && event.target.checked) {
                document.getElementById("subject1").checked = false;
                document.getElementById("subject2").checked = false;
                document.getElementById("subject3").checked = false;
                currentSubject = 3;
            }
            console.log("stop");
            let cbs = document.getElementsByName("subject");
            cbs.forEach(cb => {
                if (cb.id !== "subject" + (currentSubject+1)) {
                    cb.checked = false;
                }
            })
            this.p.setTask();
        }
    }

    static renderText(data) {
        let i = Math.floor(Math.random()*data.length);
        randomTask = data[i];
        ans = [randomTask.l[0], randomTask.l[1], randomTask.l[2], randomTask.l[3]];
        Presenter.shuffle(ans);
        questionCount++;
        if (currentSubject === 1) {
            let a = randomTask.a;
            katex.render(a, question, {throwOnError: false});
            document.getElementById("A").value = ans[0];
            katex.render(ans[0], A, {throwOnError: false});
            document.getElementById("B").value = ans[1];
            katex.render(ans[1], B, {throwOnError: false});
            document.getElementById("C").value = ans[2];
            katex.render(ans[2], C, {throwOnError: false});
            document.getElementById("D").value = ans[3];
            katex.render(ans[3], D, {throwOnError: false});
            document.getElementById("A").setAttribute("number", "0");
            document.getElementById("B").setAttribute("number", "1");
            document.getElementById("C").setAttribute("number", "2");
            document.getElementById("D").setAttribute("number", "3");
        } else {
            document.getElementById("question").innerHTML = randomTask.a;
            for (let i = 0; i < 4; i++) {
                let wert = ans[i];
                let pos = i;
                this.inscribeButtons(i, wert, pos); // Tasten beschriften -> View -> Antworten
            }
            /*
            document.getElementById("A").value = ans[0];
            document.getElementById("A").innerHTML = ans[0];
            document.getElementById("B").value = ans[1];
            document.getElementById("B").innerHTML = ans[1];
            document.getElementById("C").value = ans[2];
            document.getElementById("C").innerHTML = ans[2];
            document.getElementById("D").value = ans[3];
            document.getElementById("D").innerHTML = ans[3];
        */
        }

/*
        this.clearElement("question");
        document.getElementById("question").innerHTML = data;

        let div = document.getElementById("boo");
        let p = document.getElementById("p");
        p.innerHTML = data;
        div.appendChild(p);

 */
    }
    updateScore() {
        document.getElementById("pct").value = winCount;
        document.getElementById("pcf").value = failCount;
    }
    resetScore() {
        winCount = failCount = questionCount = 0;
        this.updateScore();
    }
}

function switchSubject(target) {
    currentSubject = 0;
    console.log("Subject switching to ", currentSubject);
    pres.setTask();
}

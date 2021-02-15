package com.example.promob;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.view.View;

import java.util.Arrays;


public class QuizActivity extends AppCompatActivity {

    //constructeurs

    private TextView ScoreView, QuestionView;
    private Button TrueButton, FalseButton;
    private ImageView VueImage;

    private boolean Reponse;
    public static int Score = 0;
    private int NumeroQuestion = 0;


    private Integer[] tabRedondance;
    private int i = 0;

    private MediaPlayer ring;
    private MediaPlayer faux;
    private MediaPlayer vrai;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        ring= MediaPlayer.create(QuizActivity.this,R.raw.quizmusic);
        ring.setLooping(true);
        faux= MediaPlayer.create(QuizActivity.this,R.raw.wrong);
        vrai= MediaPlayer.create(QuizActivity.this,R.raw.correct);
       // mp.setDataSource(url);







        ScoreView = (TextView) findViewById(R.id.ScoreNumber);
        QuestionView = (TextView) findViewById(R.id.Question);
        TrueButton = (Button) findViewById(R.id.trueButton);
        FalseButton = (Button) findViewById(R.id.falseButton);
        VueImage = (ImageView)findViewById(R.id.imageView);
        tabRedondance = new Integer[]{(int)(Math.random()*((19-0)+1))+0,-1,-1,-1,-1,-1,-1,-1,-1,-1};
        avancerQuestion(tabRedondance[0]);


        //Création du tableau avec des valeurs aléatoires différentes les unes des autres

        int k = 1;
        int alea = (int)(Math.random()*((18-0)+1))+0;

        while(k!=10)
        {
            boolean test = false;

            while(test==false){
                if(!Arrays.asList(tabRedondance).contains(alea)){
                    tabRedondance[k]=alea;
                    test=true;
                    alea = (int)(Math.random()*((18-0)+1))+0;
                }

                else {
                    alea = (int)(Math.random()*((18-0)+1))+0;
                }
            }
            k+=1;
        }


        //Gestion d'une réponse valant True :

        TrueButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view){
                if (Reponse == true) {
                    Score += 1;
                    i+=1;
                    avancerScore(Score);
                    vrai.start();

                    if (NumeroQuestion == 10) //si on arrive à la dernière question
                    {
                        Intent i = new Intent(QuizActivity.this, ResultActivity.class);
                        Bundle bundle = new Bundle();// pour donner le score à la prochaine activité
                        bundle.putInt("ScoreFinal", Score);
                        i.putExtras(bundle);
                        QuizActivity.this.finish();
                        startActivity(i);
                        ring.stop();
                        Score = 0;
                    } else {

                        Integer valeur = tabRedondance[i];
                        avancerQuestion(valeur);
                    }
                }
                else {
                    faux.start();
                    i+=1;
                    if (NumeroQuestion == 10) //si on arrive à la dernière question
                    {
                        Intent i = new Intent(QuizActivity.this, ResultActivity.class);
                        Bundle bundle = new Bundle();// pour donner le score à la prochaine activité
                        bundle.putInt("ScoreFinal", Score);
                        i.putExtras(bundle);
                        QuizActivity.this.finish();
                        startActivity(i);
                        ring.stop();
                        Score = 0;
                    } else {
                        Integer valeur = tabRedondance[i];
                        avancerQuestion(valeur);
                    }
                }
            }
        });


        //Gestion d'une réponse valant False :

        FalseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view){
                if (Reponse == false) {
                    Score += 1;
                    i+=1;
                    avancerScore(Score);
                    vrai.start();

                    if (NumeroQuestion == 10) //si on arrive à la dernière question
                    {
                        Intent i = new Intent(QuizActivity.this, ResultActivity.class);
                        Bundle bundle = new Bundle();// pour donner le score à la prochaine activité
                        bundle.putInt("ScoreFinal", Score);
                        i.putExtras(bundle);
                        QuizActivity.this.finish();
                        startActivity(i);
                        ring.stop();
                        Score = 0;
                    } else {
                        Integer valeur = tabRedondance[i];
                        avancerQuestion(valeur);
                    }
                }
                else {
                    faux.start();
                    i+=1;
                    if (NumeroQuestion == 10) //si on arrive à la dernière question
                    {
                        Intent i = new Intent(QuizActivity.this, ResultActivity.class);
                        Bundle bundle = new Bundle();// pour donner le score à la prochaine activité
                        bundle.putInt("ScoreFinal", Score);
                        i.putExtras(bundle);
                        QuizActivity.this.finish();
                        startActivity(i);
                        ring.stop();
                        Score = 0;
                    } else {
                        Integer valeur = tabRedondance[i];
                        avancerQuestion(valeur);
                    }
                }
            }
        })
        ;}


    //methodes
    private void avancerQuestion(Integer val){

        int genererQuestion = val;

        VueImage.setImageResource(Quiz.images[genererQuestion]);
        QuestionView.setText(Quiz.questions[genererQuestion]); //On passe à la prochaine question : A CHANGER ICI POUR AVOIR QUESTIONS RANDOM
        Reponse = Quiz.reponses[genererQuestion]; //On passe à la prochaine réponse
        NumeroQuestion += 1; //On actualise le numéro de la question

    }

    @Override
    protected void onPause(){
        super.onPause();
        ring.pause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        ring.start();

    }

    private void avancerScore(int point){
        ScoreView.setText("" + Score);
    }
}
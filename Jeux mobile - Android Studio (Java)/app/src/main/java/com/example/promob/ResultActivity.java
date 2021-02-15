package com.example.promob;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class ResultActivity extends AppCompatActivity {

    TextView ScoreF;
    Button RestartQuizButton;
    Button menu;
    TextView Commentaire;

    private MediaPlayer com1;
    private MediaPlayer com2;
    private MediaPlayer com3;
    private MediaPlayer com4;

    private MediaPlayer bouton;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);



        ScoreF = (TextView)findViewById(R.id.ScoreF);
        Commentaire = (TextView)findViewById(R.id.com);

        com1= MediaPlayer.create(ResultActivity.this,R.raw.bad);
        com2= MediaPlayer.create(ResultActivity.this,R.raw.pasmal);
        com3= MediaPlayer.create(ResultActivity.this,R.raw.bien);
        com4= MediaPlayer.create(ResultActivity.this,R.raw.sansfaute);

        bouton = MediaPlayer.create(ResultActivity.this,R.raw.sonbouton);


        Bundle bundle = getIntent().getExtras();
        int score = bundle.getInt("ScoreFinal");

        ScoreF.setText((score + " bonnes reponses sur 10."));

        if(score<=4)
        {
            Commentaire.setText("Revisez votre geographie.");
            com1.start();
        }

        if(score>=5 && score <=7)
        {
            Commentaire.setText("Pas mal ! Vous ferez mieux la prochaine fois.");
            com2.start();
        }

        if(score>=8 && score<10)
        {
            Commentaire.setText("Bravo ! Vous etes un pro de la geographie.");
            com3.start();
        }

        if(score ==10)
        {
            Commentaire.setText("Un sans faute ! Vous etes incollable, bravo !");
           com4.start();
        }

        //affichage d'un message selon score et musique en conséquence


        RestartQuizButton = (Button)findViewById(R.id.RestartButton);
        menu = (Button)findViewById(R.id.menuprincipal);

        RestartQuizButton.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(ResultActivity.this, QuizActivity.class));
                ResultActivity.this.finish();
            }
        });

        menu.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(ResultActivity.this, MainActivity.class));
                ResultActivity.this.finish();
            }
        });


    }

    @Override
    protected void onPause(){
        super.onPause();
        com1.pause();
        com2.pause();
        com3.pause();
        com4.pause();
    }


}



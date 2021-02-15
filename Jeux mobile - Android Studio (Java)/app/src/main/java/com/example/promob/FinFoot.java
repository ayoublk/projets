package com.example.promob;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class FinFoot extends AppCompatActivity {

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

        com1= MediaPlayer.create(FinFoot.this,R.raw.bad);
        com2= MediaPlayer.create(FinFoot.this,R.raw.pasmal);
        com3= MediaPlayer.create(FinFoot.this,R.raw.bien);
        com4= MediaPlayer.create(FinFoot.this,R.raw.sansfaute);

        bouton = MediaPlayer.create(FinFoot.this,R.raw.sonbouton);


        Bundle bundle = getIntent().getExtras();
        int score = bundle.getInt("ScoreFinal");

        ScoreF.setText((score + " TIRS REUSSIS SUR 5"));

        if(score<=2)
        {
            Commentaire.setText("Mettez-vous a la danse");
            com1.start();
        }

        if(score>=2 && score <=4)
        {
            Commentaire.setText("Pas mal ! ");
            com2.start();
        }



        if(score ==5)
        {
            Commentaire.setText("Un sans faute ! ");
            com4.start();
        }

        //affichage d'un message selon score et musique en conséquence


        RestartQuizButton = (Button)findViewById(R.id.RestartButton);
        menu = (Button)findViewById(R.id.menuprincipal);

        RestartQuizButton.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(FinFoot.this, FootActivity.class));
                FinFoot.this.finish();
            }
        });

        menu.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(FinFoot.this, MainActivity.class));
                FinFoot.this.finish();
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



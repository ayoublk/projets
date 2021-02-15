package com.example.promob;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class FinObstacles extends AppCompatActivity {

    Button recommencer;
    Button menu;
    TextView chronometre;
    private MediaPlayer ring;
    private MediaPlayer bouton;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fin_obstacles);

        recommencer = (Button) findViewById(R.id.restart);
        menu = (Button) findViewById(R.id.menuprincipal);
        chronometre = (TextView) findViewById(R.id.Temps);
        ring= MediaPlayer.create(FinObstacles.this,R.raw.finobstacle);
        bouton = MediaPlayer.create(FinObstacles.this,R.raw.sonbouton);


        ring.start();


        Bundle bundle = getIntent().getExtras();
        String temps = bundle.getString("Temps");

        chronometre.setText(temps + " min");

        recommencer.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view) {
                bouton.start();
                startActivity(new Intent(FinObstacles.this, Obstacles.class));
                FinObstacles.this.finish();
            }
        });

        menu.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view) {
                bouton.start();
                startActivity(new Intent(FinObstacles.this, MainActivity.class));
                FinObstacles.this.finish();
            }
        });

    }

    @Override
    protected void onPause(){
        super.onPause();
        ring.pause();
    }

    @Override
    protected void onResume(){
        super.onResume();
        ring.start();
    }
}
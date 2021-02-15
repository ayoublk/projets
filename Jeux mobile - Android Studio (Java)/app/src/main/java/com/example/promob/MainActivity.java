package com.example.promob;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    Button StartQuizButton;
    Button StartFoot;
    Button StartObstacles;
    private MediaPlayer ring;
    private MediaPlayer bouton;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_main);

        ring= MediaPlayer.create(MainActivity.this,R.raw.intro);
        ring.start();
        ring.setLooping(true);
        bouton = MediaPlayer.create(MainActivity.this,R.raw.sonbouton);

        TextView choix = (TextView) findViewById(R.id.ChoiceText );


        Animation anim = new AlphaAnimation(0.0f, 1.0f);
        anim.setDuration(100); //You can manage the blinking time with this parameter
        anim.setStartOffset(20);
        anim.setRepeatMode(Animation.REVERSE);
        anim.setRepeatCount(Animation.INFINITE);
        choix.startAnimation(anim);

        StartQuizButton = (Button)findViewById(R.id.quiz);
        StartQuizButton.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(MainActivity.this, QuizActivity.class));
                ring.stop();
                MainActivity.this.finish();
            }
        });

        StartFoot = (Button)findViewById(R.id.foot);
        StartFoot.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(MainActivity.this, FootActivity.class));
                ring.stop();
                MainActivity.this.finish();
            }
        });

        StartObstacles = (Button)findViewById(R.id.obstacles);
        StartObstacles.setOnClickListener(new View.OnClickListener() {

            public void onClick(View view)
            {
                bouton.start();
                startActivity(new Intent(MainActivity.this, Obstacles.class));
                ring.stop();
                MainActivity.this.finish();
            }
        });




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



}

package com.example.promob;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.graphics.Point;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.view.Display;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Chronometer;
import android.widget.ImageView;

import java.util.Timer;
import java.util.TimerTask;

public class Obstacles extends AppCompatActivity implements SensorEventListener {

    //Taille de l'écran
    private int hauteur;
    private int largeur;

    //joueur
    private ImageView bob;
    private float bobX;
    private float bobY;

    //Obstacle bowser
    private ImageView bowser;
    private float bowserX;
    private float bowserY;

    //Obstacle voldemort
    private ImageView voldemort;
    private float voldemortX;
    private float voldemortY;

    //Obstacle magicarpe
    private ImageView magicarpe;
    private float magicarpeX;
    private float magicarpeY;

    //Obstacle eggman
    private ImageView eggman;
    private float eggmanX;
    private float eggmanY;

    private Handler handler = new Handler();
    private Timer timer = new Timer();

    //Gyroscope
    private SensorManager senSensorManager;
    private Sensor senAccelerometer;

    //Musique
    private MediaPlayer ring;

    //Chrono
    public static Chronometer Chrono;

    //Position
    private int x;
    private int y;

    //Pour savoir si la collision a eu lieu;
    private boolean collision;

    //
    private float cadenceBowser;
    private float cadenceVoldemort;
    private float cadenceMagicarpe;
    private float cadenceEggman;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE); // enlever le nom
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN); // Mettre en plein écran

        setContentView(R.layout.activity_obstacles);

        //Musique
        ring= MediaPlayer.create(Obstacles.this,R.raw.obstacles);
        ring.start();
        ring.setLooping(true);

        //Chrono
        Chrono = (Chronometer) findViewById(R.id.chronometre);
        Chrono.start();

        //Sensor : initialisation des variables et listener
        senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        senAccelerometer = senSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        senSensorManager.registerListener(this, senAccelerometer , SensorManager.SENSOR_DELAY_GAME);

        //Image du joueur
        bob = (ImageView)findViewById(R.id.pikachu);

        //Image des obstacles
        bowser = (ImageView)findViewById(R.id.pokeball);
        voldemort = (ImageView)findViewById(R.id.superball);
        magicarpe = (ImageView)findViewById(R.id.hyperball);
        eggman = (ImageView)findViewById(R.id.masterball);

        //Récupérer les dimensions de l'écran
        WindowManager windowManager = getWindowManager();
        Display display = windowManager.getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);

        largeur = size.x;
        hauteur = size.y;

        collision=true;

        cadenceBowser = 12;
        cadenceEggman = 12;
        cadenceMagicarpe = 12;
        cadenceVoldemort = 12;

        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        changerPositionObstacle();
                        changerPositionJoueur();

                        if(collision)
                        {
                            collision();
                        }
                    }
                });
            }
        }, 0, 15);
    }

    public void changerPositionObstacle() {

        bowserY -=cadenceBowser; //cadence de déplacement en ordonnées
        voldemortY-=cadenceVoldemort;
        magicarpeY-=cadenceMagicarpe;
        eggmanY-=cadenceEggman;

        if(bowser.getY() + bowser.getHeight() < 0)
        {
            bowserX = (float)Math.floor(Math.random() * (largeur - bowser.getWidth()));
            bowserY = hauteur + 100.0f;
            cadenceBowser +=0.7;
        }

        bowser.setX(bowserX);
        bowser.setY(bowserY);

        if(magicarpe.getY() + magicarpe.getHeight() < 0)
        {
            magicarpeX = (float)Math.floor(Math.random() * (largeur - magicarpe.getWidth()));
            magicarpeY = hauteur + 100.0f;
            cadenceMagicarpe += 0.8;
        }

        magicarpe.setX(magicarpeX);
        magicarpe.setY(magicarpeY);

        if(voldemort.getY() + voldemort.getHeight() < 0)
        {
            voldemortX = (float)Math.floor(Math.random() * (largeur - voldemort.getWidth()));
            voldemortY = hauteur + 100.0f;
            cadenceVoldemort += 0.6;
        }
        voldemort.setX(voldemortX);
        voldemort.setY(voldemortY);

        if(eggman.getY() + eggman.getHeight() < 0)
        {
            eggmanX = (float)Math.floor(Math.random() * (largeur - eggman.getWidth()));
            eggmanY = hauteur + 100.0f;
            cadenceEggman+=0.6;
        }
        eggman.setX(eggmanX);
        eggman.setY(eggmanY);

    }

    public void changerPositionJoueur(){
        bobY = (hauteur/3f);
        bob.setY(bobY);
    }

    public void collision() {

        if(((bowser.getY() >= (bob.getY()-(bob.getHeight()/2))) && (bowser.getY() <= (bob.getY()+(bob.getHeight()/2))) && (bowser.getX() >= bob.getX()-(bob.getWidth()/2)) && (bowser.getX() <= bob.getX() + (bob.getWidth()/2))))
        {
            Intent i = new Intent(Obstacles.this, FinObstacles.class);
            i.putExtra("Temps", Chrono.getText());
            collision = false;
            Obstacles.this.finish();
            startActivity(i);
        }

        if((voldemort.getY() >= (bob.getY()-(bob.getHeight()/2))) && (voldemort.getY() <= (bob.getY()+(bob.getHeight()/2))) && (voldemort.getX() >= bob.getX()-(bob.getWidth()/2)) && (voldemort.getX() <= bob.getX() + (bob.getWidth()/2)) )
        {
            Intent i = new Intent(Obstacles.this, FinObstacles.class);
            i.putExtra("Temps", Chrono.getText());
            collision = false;
            Obstacles.this.finish();
            startActivity(i);
        }

        if((magicarpe.getY() >= (bob.getY()-(bob.getHeight()/2))) && (magicarpe.getY() <= (bob.getY()+(bob.getHeight()/2))) && (magicarpe.getX() >= bob.getX()-(bob.getWidth()/2))&& (magicarpe.getX() <= bob.getX() + (bob.getWidth()/2))){

            Intent i = new Intent(Obstacles.this, FinObstacles.class);
            i.putExtra("Temps", Chrono.getText());
            collision = false;
            Obstacles.this.finish();
            startActivity(i);
        }

        if((eggman.getY() >= (bob.getY()-(bob.getHeight()/2))) && (eggman.getY() <= (bob.getY()+(bob.getHeight()/2))) && (eggman.getX() >= bob.getX()-(bob.getWidth()/2)) && (eggman.getX() <= bob.getX() + (bob.getWidth()/2))){

            Intent i = new Intent(Obstacles.this, FinObstacles.class);
            i.putExtra("Temps", Chrono.getText());
            collision = false;
            Obstacles.this.finish();
            startActivity(i);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        if (bob.getX() <= 50) {
            x = 50;
        }

        if (bob.getX() >= largeur - 200) {
            x = largeur - 200 ;
        }

        if (sensorEvent.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            x -= (int) sensorEvent.values[0] * 5;
        }

        bob.setX(x);

    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    @Override
    protected void onPause(){
        super.onPause();
        senSensorManager.unregisterListener(this);
        ring.pause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        senSensorManager.registerListener(this, senAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        ring.start();

    }

}
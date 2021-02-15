package com.example.promob;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.view.Display;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.WindowManager;

import androidx.annotation.RequiresApi;

// SurfaceView est une surface de dessin.
// référence : https://developer.android.com/reference/android/view/SurfaceView
public class Foot extends SurfaceView implements SurfaceHolder.Callback {

    // déclaration de l'objet définissant la boucle principale de déplacement et de rendu
    private GameLoopThread gameLoopThread;
    private Balle balle;
    private Gardien gardien;
    boolean deplacer=false;

    int position_debut_x=0;
    int position_debut_y=0;
    int position_fin_x=0;
    int position_fin_y=0;
    boolean changement_sens=false;
    int hauteur;
    int largeur;
Context mContext;
    String res="";
    MediaPlayer ring;
    // création de la surface de dessin
    public Foot(Context context, WindowManager manager) {
        super(context);
        getHolder().addCallback(this);
        gameLoopThread = new GameLoopThread(this);
mContext = context;
        // création d'un objet "balle", dont on définira la largeur/hauteur
        // selon la largeur ou la hauteur de l'écran
        ring= MediaPlayer.create(mContext,R.raw.suspense);
        ring.start();

        Display ecran = manager.getDefaultDisplay();
         largeur= ecran.getWidth();
        hauteur= ecran.getHeight();
        balle = new Balle(this.getContext());
        gardien = new Gardien(this.getContext());
    }

    // Fonction qui "dessine" un écran de jeu
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public void doDraw(Canvas canvas) {

        if(canvas==null) {return;}

        // on efface l'écran, en blanc
        //canvas.drawColor(Color.GREEN);
      //  canvas.drawPicture();
        Drawable d;
        d = getResources().getDrawable(R.mipmap.promobfoot, null);
        d.setBounds(0, 0, largeur, hauteur);
        d.draw(canvas);
        // on dessine la balle
        balle.draw(canvas);
        gardien.draw(canvas);
        //pour afficher a l'ecran

            Paint paint = new Paint();
            paint.setStyle(Paint.Style.FILL);
            paint.setColor(Color.WHITE);
            paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
            paint.setTextSize(100);
            paint.setTextAlign(Paint.Align.CENTER);
            canvas.drawText(res, largeur/2, hauteur/2, paint);
        paint.setTextSize(70);
             canvas.drawText("Essaie restant : "+balle.getCompteur_tentative(), largeur/2, (hauteur/2)+150, paint);


        if(balle.getCompteur_tentative()==0){
            Intent i = new Intent(mContext, FinFoot.class);
            Bundle bundle = new Bundle();// pour donner le score à la prochaine activité
            bundle.putInt("ScoreFinal", balle.getCompteur_reussite());
            i.putExtras(bundle);
            ((Activity)(mContext)).finish();

            mContext.startActivity(i);
           ring.stop();
          balle.setCompteur_reussite();;
          balle.setCompteur_tentative();
        }
    }

    // Fonction appelée par la boucle principale (gameLoopThread)
    // On gère ici le déplacement des objets
    public void update() {
        if(deplacer) {
           res= balle.moveDirection(position_debut_x,position_debut_y,position_fin_x,position_fin_y,changement_sens,gardien);
        }
        gardien.moveDirection();

    }

    // Fonction obligatoire de l'objet SurfaceView
    // Fonction appelée immédiatement après la création de l'objet SurfaceView
    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
        // création du processus GameLoopThread si cela n'est pas fait
        if(gameLoopThread.getState()== Thread.State.TERMINATED) {
            gameLoopThread=new GameLoopThread(this);
        }
        gameLoopThread.setRunning(true);
        gameLoopThread.start();
    }

    // Fonction obligatoire de l'objet SurfaceView
    // Fonction appelée juste avant que l'objet ne soit détruit.
    // on tente ici de stopper le processus de gameLoopThread
    @Override
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
        boolean retry = true;
        gameLoopThread.setRunning(false);
        while (retry) {
            try {
                gameLoopThread.join();
                retry = false;
            }
            catch (InterruptedException e) {}
        }
    }

    // Gère les touchés sur l'écran
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int currentX = (int)event.getX();
        int currentY = (int)event.getY();




        switch (event.getAction()) {

            // code exécuté lorsque le doigt touche l'écran.
            case MotionEvent.ACTION_DOWN:
                // si le doigt touche la balle :
                if(balle.getY()>(hauteur/2)&& currentY>(hauteur/2)){

                    if (currentX >= balle.getX() &&
                            currentX <= balle.getX() + balle.getBalleW() &&
                            currentY >= balle.getY() && currentY <= balle.getY() + balle.getBalleH()) {
                        // on arrête de déplacer la balle
                        balle.setMove(false);
                    }
                    deplacer = true;

                    position_debut_x = currentX;
                    position_debut_y = currentY;
                }
                break;

            // code exécuté lorsque le doight glisse sur l'écran.
            case MotionEvent.ACTION_MOVE:
                // on déplace la balle sous le doigt du joueur
                // si elle est déjà sous son doigt (oui si on a setMove à false)
               //Log.d("hauter",String.valueOf(hauteur/2));

                if(!balle.isMoving() && balle.getY()>hauteur/2 && currentY>hauteur/2) {
                    balle.setX(currentX);
                    balle.setY(currentY);


                }

                 else if(balle.getY()>=(hauteur-100)/2){
                    //notre current y ne change jamais don cca se stop

                    position_fin_x=currentX;
                    position_fin_y=currentY;

                    float deltaX = position_fin_x - position_debut_x;
                    float deltaY = position_fin_y - position_debut_y;
                    if((deltaX<0 &&deltaY>0)||(deltaX<0 && deltaY<0)){
                        changement_sens=true;
                    }else {
                        changement_sens=false;
                    }
                    balle.setMove(true);
                    //il faut mettre un booelan de l'autre coté qui va lui permettre de rentrer ici que si il touche un bord

                }

                break;

            // lorsque le doigt quitte l'écran
            case MotionEvent.ACTION_UP:
                // on reprend le déplacement de la balle
                if(balle.getY()>(hauteur/2) && currentY>(hauteur/2)) {

                    position_fin_x = currentX;
                    position_fin_y = currentY;
                    if(position_debut_x!=position_fin_x) {
                        float deltaX = position_fin_x - position_debut_x;
                        float deltaY = position_fin_y - position_debut_y;
                        if ((deltaX < 0 && deltaY > 0) || (deltaX < 0 && deltaY < 0)) {
                            changement_sens = true;
                        } else {
                            changement_sens = false;
                        }

                        balle.setMove(true);
                    }
                }

        }

        return true;  // On retourne "true" pour indiquer qu'on a géré l'évènement
    }

    // Fonction obligatoire de l'objet SurfaceView
    // Fonction appelée à la CREATION et MODIFICATION et ONRESUME de l'écran
    // nous obtenons ici la largeur/hauteur de l'écran en pixels
    @Override
    public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int w, int h) {
        balle.resize(w,h); // on définit la taille de la balle selon la taille de l'écran
        gardien.resize(w,h);
    }

} // class GameView
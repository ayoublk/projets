package com.example.promob;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;

class Balle {
    private BitmapDrawable img = null; // image de la balle
    private int x, y; // coordonnées x,y de la balle en pixel
    private int balleW, balleH; // largeur et hauteur de la balle en pixels
    private int wEcran, hEcran; // largeur et hauteur de l'écran en pixels
    private boolean move = true; // 'true' si la balle doit se déplacer automatiquement, 'false' sinon

    // pour déplacer la balle on ajoutera INCREMENT à ses coordonnées x et y
    private static final int INCREMENT = 50;
    private int speedX = INCREMENT, speedY = INCREMENT;
    private double direction;
    // contexte de l'application Android
    // il servira à accéder aux ressources, dont l'image de la balle
    private final Context mContext;
    private int position_depart_x ;
    private int position_depart_y ;
    Canvas _canvas;
    String res="Lancer le ballon";
    int compteur_tentative=5;
    int compteur_reussite=0;
    // Constructeur de l'objet "Balle"
    MediaPlayer goal;
    public Balle(final Context c) {
        goal= MediaPlayer.create(c,R.raw.goal);
        mContext = c; // sauvegarde du contexte
    }

    // on attribue à l'objet "Balle" l'image passée en paramètre
    // w et h sont sa largeur et hauteur définis en pixels
    public BitmapDrawable setImage(final Context c, final int ressource, final int w, final int h) {
        Drawable dr = c.getResources().getDrawable(ressource);
        Bitmap bitmap = ((BitmapDrawable) dr).getBitmap();
        return new BitmapDrawable(c.getResources(), Bitmap.createScaledBitmap(bitmap, w, h, true));
    }

    // retourne 'true' si la balle se déplace automatiquement
    // 'false' sinon
    // car on la bloque sous le doigt du joueur lorsqu'il la déplace
    public boolean isMoving() {
        return move;
    }

    // définit si oui ou non la balle doit se déplacer automatiquement
    // car on la bloque sous le doigt du joueur lorsqu'il la déplace
    public void setMove(boolean move) {
        this.move = move;
    }

    // redimensionnement de l'image selon la largeur/hauteur de l'écran passés en paramètre
    public void resize(int wScreen, int hScreen) {
        // wScreen et hScreen sont la largeur et la hauteur de l'écran en pixel
        // on sauve ces informations en variable globale, car elles serviront
        // à détecter les collisions sur les bords de l'écran
        wEcran = wScreen;
        hEcran = hScreen;
        balleW = wScreen / 10;
        balleH = wScreen / 10;
        position_depart_x = wEcran / 2 - balleW/2;
        position_depart_y = hEcran - balleH;
        x = position_depart_x;
        y = position_depart_y;
        // on définit (au choix) la taille de la balle à 1/5ème de la largeur de l'écran

        img = setImage(mContext, R.mipmap.ball, balleW, balleH);

    }

    // définit la coordonnée X de la balle
    public void setX(int x) {
        this.x = x;
    }

    // définit la coordonnée Y de la balle
    public void setY(int y) {
        this.y = y;
    }

    // retourne la coordonnée X de la balle
    public int getX() {
        return x;
    }

    // retourne la coordonnée Y de la balle
    public int getY() {
        return y;
    }

    // retourne la largeur de la balle en pixel
    public int getBalleW() {
        return balleW;
    }

    // retourne la hauteur de la balle en pixel
    public int getBalleH() {
        return balleH;
    }

    public int getCompteur_tentative() {
        return compteur_tentative;
    }

    // retourne la hauteur de la balle en pixel
    public int getCompteur_reussite() {
        return compteur_reussite;
    }

    public void setCompteur_tentative() {
         compteur_tentative=5;
    }

    // retourne la hauteur de la balle en pixel
    public void setCompteur_reussite() {
         compteur_reussite=0;
    }




    public String moveDirection(float xa, float ya, float xb, float yb, boolean changement_sens, Gardien gardien) {

        if (!move) {
            return res;
        } else {
            float deltaX = xb - xa;
            float deltaY = yb - ya;


            direction = Math.atan(deltaY / deltaX);
            // Log.d("div ",  String.valueOf(direction));
            if (!changement_sens) {
                this.x = (int) (this.getX() + (speedX * Math.cos(direction)));
                this.y = (int) (this.getY() + (speedY * Math.sin(direction)));
            } else {
                this.x = (int) (this.getX() - (speedX * Math.cos(direction)));
                this.y = (int) (this.getY() - (speedY * Math.sin(direction)));
            }

        }
        if (x + balleW > wEcran) {
            compteur_tentative-=1;
            x = position_depart_x;
            y = position_depart_y;
            move = false;
            res="TU ES NULLL";
            return res;
        }

        // si y dépasse la hauteur l'écran vers le bas, on remet le ballon
        if (y + balleH > hEcran) {

            y = position_depart_y;
            x = position_depart_x;
            move = false;
            res="LANCE VERS LE HAUT";
            return res;
        }

        // si x passe à gauche de l'écran, on ion remet le ballon
        if (x < 0) {
            compteur_tentative-=1;
            x = position_depart_x;
            y = position_depart_y;
            move = false;
            res="TU ES NULLL";
            return res;
        }

        // si on est dans le but
        if (y < ((hEcran*12)/100) && x+balleW/2>((wEcran*30.5)/100) && x-balleW/2<((wEcran*70.3)/100)) {
            compteur_tentative-=1;
            compteur_reussite+=1;
            y = position_depart_y;
            x = position_depart_x;
            move = false;
            res="BUUUUT !!!";
            goal.start();
            return res;

        }
        //si le gardien l'attrape
        if (x+balleW>gardien.getX() && x<gardien.getX()+gardien.getBalleW() && y<=gardien.getY() ) {
            compteur_tentative-=1;
            y = position_depart_y;
            x = position_depart_x;
            move = false;
            res= "SUR LE GOAL";
            return res ;

        }

return res;

    }


    // on dessine la balle, en x et y
    public void draw(Canvas canvas) {

        if (img == null) {
            return;
        }
        canvas.drawBitmap(img.getBitmap(), x, y, null);

    }

} // public class Balle
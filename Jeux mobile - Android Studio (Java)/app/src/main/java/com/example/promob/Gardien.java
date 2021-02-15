package com.example.promob;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;

public class Gardien {

    private BitmapDrawable img = null; // image de la balle
    private int x, y; // coordonnées x,y de la balle en pixel
    private int balleW, balleH; // largeur et hauteur de la balle en pixels
    private int wEcran, hEcran; // largeur et hauteur de l'écran en pixels
    private boolean move = true; // 'true' si la balle doit se déplacer automatiquement, 'false' sinon

    // pour déplacer la balle on ajoutera INCREMENT à ses coordonnées x et y
    private static final int INCREMENT = 10;
    private int speedX = INCREMENT, speedY = INCREMENT;
    private double direction;
    // contexte de l'application Android
    // il servira à accéder aux ressources, dont l'image de la balle
    private final Context mContext;
    private int position_depart_x ;
    private int position_depart_y ;


    // Constructeur de l'objet "Balle"
    public Gardien(final Context c) {

        mContext = c; // sauvegarde du contexte
    }

    // on attribue à l'objet "Balle" l'image passée en paramètre
    // w et h sont sa largeur et hauteur définis en pixels
    public BitmapDrawable setImage(final Context c, final int ressource, final int w, final int h) {
        Drawable dr = c.getResources().getDrawable(ressource);
        Bitmap bitmap = ((BitmapDrawable) dr).getBitmap();
        return new BitmapDrawable(c.getResources(), Bitmap.createScaledBitmap(bitmap, w, h, true));
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
        balleW = wScreen / 5;
        balleH = wScreen / 8;
        //on le fait partir au niveau du poteau droite
        position_depart_x = (int)(wEcran*30.5)/100;
        position_depart_y = (int)(hEcran*15)/100;
        x = position_depart_x;
        y = position_depart_y;
        // on définit (au choix) la taille de la balle à 1/5ème de la largeur de l'écran

        img = setImage(mContext, R.mipmap.gardien, balleW, balleH);

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




    public void moveDirection() {


                x+=speedX;
//70.5
    //on deplace le goal en fonction du pourcentage que prend le but (calcul fait en fonction des picels sur photo de base)
        if (x + balleW > (wEcran*74)/100) {
            speedX=-INCREMENT;

        }

//30.5
        // si x passe à gauche de l'écran, on ion remet le ballon
        if (x < (wEcran*27)/100) {
            speedX=INCREMENT;

        }




    }


    // on dessine la balle, en x et y
    public void draw(Canvas canvas) {
        if (img == null) {
            return;
        }
        canvas.drawBitmap(img.getBitmap(), x, y, null);

    }

}

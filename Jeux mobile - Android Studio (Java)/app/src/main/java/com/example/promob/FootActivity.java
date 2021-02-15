package com.example.promob;

import android.app.Activity;
import android.os.Bundle;

public class FootActivity extends Activity {

    private Foot gameView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // On cré un objet "GameView" qui est le code principal du jeu
        gameView = new Foot(this, getWindowManager());

        // et on l'affiche.
        setContentView(gameView);

    }
}

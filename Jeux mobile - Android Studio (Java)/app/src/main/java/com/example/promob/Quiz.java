package com.example.promob;

public class Quiz {

    public static String[] questions = new String []{ //ensemble de 19 questions
            "Est-ce Bordeaux ?",
            "Est-ce Brest ?",
            "Est-ce Caen ?",
            "Est-ce Cherbourg ?",
            "Est-ce Clermont-Ferrand ?",
            "Est-ce Grenoble ?",
            "Est-ce La Rochelle ?",
            "Est-ce Lille ?",
            "Est-ce Marseille ?",
            "Est-ce Nancy ?",
            "Est-ce Nantes ?",
            "Est-ce Nice ?",
            "Est-ce Nimes ?",
            "Est-ce Orleans ?",
            "Est-ce Paris ?",
            "Est-ce Pau ?",
            "Est-ce Rennes ?",
            "Est-ce Strasbourg ?",
            "Est-ce Troyes ?",
    };

    public static int[] images = new int[]{
            R.drawable.bordeaux, R.drawable.brest, R.drawable.caen, R.drawable.cherbourg, R.drawable.clermontferrand,
            R.drawable.grenoble, R.drawable.larochelle, R.drawable.lille, R.drawable.marseille, R.drawable.nancy,
            R.drawable.nantes, R.drawable.nice, R.drawable.nimes, R.drawable.orleans, R.drawable.paris,
            R.drawable.pau, R.drawable.rennes, R.drawable.strasbourg, R.drawable.troyes


    };

    public static boolean[] reponses = new boolean[] {
            true,true,false,true,true,false,true,false,false,true,true,false,false,false,true,false,false,false,true
    };
}

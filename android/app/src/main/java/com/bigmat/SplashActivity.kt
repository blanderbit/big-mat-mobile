package com.bigmat

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import androidx.core.view.WindowCompat

class SplashActivity : Activity() {
  private var started = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    window.statusBarColor = Color.TRANSPARENT
    setContentView(R.layout.activity_splash)
  }

  override fun onResume() {
    super.onResume()
    if (started) return
    started = true

    // Let at least one frame draw before switching activities.
    window.decorView.post {
      startActivity(Intent(this, MainActivity::class.java))
      overridePendingTransition(0, 0)
      finish()
    }
  }
}


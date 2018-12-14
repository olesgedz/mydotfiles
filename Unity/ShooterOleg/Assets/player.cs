using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class player : MonoBehaviour
{
    Rigidbody2D rb;
    public GameObject Bullet;
    public GameObject playerob;
    Animator anim;
    int a = 0;
    int flag = 0;
    int inair = 0;
    // Use this for initialization
    void Start()
    {
        rb = gameObject.GetComponent<Rigidbody2D>();
        anim = GetComponent<Animator>();
        playerob = GameObject.Find("player");
    }

    // Update is called once per frame
    void Update()
    {
        Flip();
        if (rb.velocity.y == 0.0)
        {
            inair = 0;
        }
        if (Input.GetAxis("Horizontal") == 0 && inair == 0)
        {
            anim.SetInteger("state", 0);
        }
        if(Input.GetAxis("Horizontal") != 0 && inair != 1)
        {
            anim.SetInteger("state", 1);
        }
        if (Input.GetKeyDown(KeyCode.Space) && inair == 0)
        {
            inair = 1;
            anim.SetInteger("state", 3);
            jump();
        }
        if (Input.GetKeyDown(KeyCode.E))
        {
            fire();
        }
    }
    private void FixedUpdate()
    {
        rb.velocity = new Vector2(Input.GetAxis("Horizontal") * 1f, rb.velocity.y);
    }
    void jump()
    {
        if (a < 2)
        {
            rb.AddForce(transform.up * 4f, ForceMode2D.Impulse);
            a = a + 1;
        }
      }
    void Flip()
    {

        if (Input.GetAxis("Horizontal") < 0 && flag == 1)
        {
            transform.localRotation = Quaternion.Euler(0, 180, 0);
            flag = 0;
        }
        if (Input.GetAxis("Horizontal") > 0 && flag == 0)
        {
            transform.localRotation = Quaternion.Euler(0, 0, 0);
            flag = 1;
        }

    }
    public void OnCollisionEnter2D(Collision2D collision)
    {
       if(a>0)
        {
            a = 0;
        }
    }
    public void fire()
    {
        GameObject Bullet1 = Instantiate(Bullet);
        Bullet1.transform.position = GameObject.Find("firepoint").transform.position;
        Bullet1.GetComponent<Rigidbody2D>().velocity = new Vector2(10,0);

       //Bullet.GetComponent<Rigidbody2D>().AddForce(new Vector2(10, 0));
    }
}
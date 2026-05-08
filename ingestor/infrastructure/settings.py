from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mqtt_host: str = "broker"
    mqtt_port: int = 1883
    mqtt_topic: str = "lab/+/+/+"

    db_host: str = "postgres"
    db_name: str = "abcd_db"
    db_user: str = "admin"
    db_password: str = "admin_pass1234"

    batch_size: int = 5


settings = Settings()